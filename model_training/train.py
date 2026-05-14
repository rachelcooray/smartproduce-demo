"""
Fine-tunes MobileNetV2 on our produce classes, then exports to TF.js.
Run after download_images.py has finished.

Usage:
    python3 train.py

Output:
    model_training/tfjs_model/   ← load this in the React app
"""
import os, pathlib, json
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator

IMG_SIZE   = 224
BATCH      = 16
EPOCHS_TOP = 10   # train head only
EPOCHS_ALL = 10   # fine-tune full model
IMAGES_DIR = pathlib.Path(__file__).parent / "images"
OUT_DIR    = pathlib.Path(__file__).parent / "tfjs_model"

def get_classes():
    return sorted([d for d in os.listdir(IMAGES_DIR)
                   if os.path.isdir(IMAGES_DIR / d) and
                   len(os.listdir(IMAGES_DIR / d)) >= 5])

def build_generators(classes):
    train_gen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.15,
        height_shift_range=0.15,
        zoom_range=0.2,
        horizontal_flip=True,
        brightness_range=[0.8, 1.2],
        validation_split=0.2,
    )
    train = train_gen.flow_from_directory(
        IMAGES_DIR, target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH, class_mode="categorical",
        classes=classes, subset="training", seed=42,
    )
    val = train_gen.flow_from_directory(
        IMAGES_DIR, target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH, class_mode="categorical",
        classes=classes, subset="validation", seed=42,
    )
    return train, val

def build_model(n_classes):
    base = MobileNetV2(input_shape=(IMG_SIZE, IMG_SIZE, 3),
                       include_top=False, weights="imagenet")
    base.trainable = False  # freeze base first
    x = base.output
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(128, activation="relu")(x)
    out = layers.Dense(n_classes, activation="softmax")(x)
    return models.Model(base.input, out), base

def main():
    classes = get_classes()
    n = len(classes)
    print(f"\n{n} classes: {classes}\n")

    train_ds, val_ds = build_generators(classes)
    model, base = build_model(n)

    # Phase 1 — head only
    model.compile(optimizer=tf.keras.optimizers.Adam(1e-3),
                  loss="categorical_crossentropy", metrics=["accuracy"])
    print("=== Phase 1: training head ===")
    model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS_TOP,
              callbacks=[tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True)])

    # Phase 2 — unfreeze top 50 layers for fine-tuning
    base.trainable = True
    for layer in base.layers[:-50]:
        layer.trainable = False
    model.compile(optimizer=tf.keras.optimizers.Adam(1e-4),
                  loss="categorical_crossentropy", metrics=["accuracy"])
    print("\n=== Phase 2: fine-tuning ===")
    model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS_ALL,
              callbacks=[tf.keras.callbacks.EarlyStopping(patience=4, restore_best_weights=True)])

    # Save Keras model
    keras_path = pathlib.Path(__file__).parent / "keras_model.keras"
    model.save(keras_path)
    print(f"\nKeras model saved → {keras_path}")

    # Save class labels alongside
    labels_path = pathlib.Path(__file__).parent / "labels.json"
    labels_path.write_text(json.dumps(classes, indent=2))
    print(f"Labels saved → {labels_path}")

    # Convert to TF.js
    OUT_DIR.mkdir(exist_ok=True)
    os.system(f'tensorflowjs_converter --input_format=keras "{keras_path}" "{OUT_DIR}"')
    print(f"\nTF.js model saved → {OUT_DIR}/")
    print("\nDone! Copy tfjs_model/ into the React app's public/ folder.")

if __name__ == "__main__":
    main()
