import logging
import sys
from tkinter import Tk, filedialog
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
import google.generativeai as genai

from core.utils import load_image, preprocess_image
from core.component_recognition import detect_components
from core.debugging_interface import detect_debugging_interfaces
from core.ml_analysis import ml_analysis
from core.assessment import hardware_security_assessment
from core.report import generate_report
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import cv2