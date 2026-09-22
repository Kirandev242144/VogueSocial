import base64
code = """import gradio as gr
from fashn_vton import TryOnPipeline
from PIL import Image
import numpy as np

print("Loading Fashn VTON v1.5 weights into GPU...")
pipeline = TryOnPipeline(weights_dir="/workspace/fashn-vton-1.5/weights")
print("Weights loaded successfully!")

def predict_tryon(dict, garm_img, category):
    person_np = dict["background"]
    person = Image.fromarray(person_np).convert("RGB")
    garment = Image.fromarray(garm_img).convert("RGB")
    print(f"Running inference for category: {category}...")
    output = pipeline(
        person_image=person,
        garment_image=garment,
        category=category
    )
    print("Inference completed!")
    return output.images[0]

interface = gr.Interface(
    fn=predict_tryon,
    inputs=[
        gr.Image(label="Person Image", type="numpy", sources=["upload"], interactive=True, tool="editor"),
        gr.Image(label="Garment Image", type="numpy", sources=["upload"]),
        gr.Dropdown(choices=["tops", "bottoms", "one-pieces"], label="Category", value="tops")
    ],
    outputs=gr.Image(label="Tryon Result", type="pil"),
    title="FASHN VTON v1.5 API"
)

interface.launch(server_name="0.0.0.0", server_port=7861, share=True)
"""
print(base64.b64encode(code.encode()).decode())
