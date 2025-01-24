from dependancies import *

def determine_optimal_clusters(pixels, max_clusters=10):
    wcss = []  
    silhouette_scores = []
    for k in range(2, max_clusters + 1):
        kmeans = KMeans(n_clusters=k, random_state=42)
        kmeans.fit(pixels)
        wcss.append(kmeans.inertia_)
        if k > 1:
            silhouette_scores.append(silhouette_score(pixels, kmeans.labels_))
    
    # elbow
    optimal_k_elbow = np.argmin(np.diff(wcss)) + 2  
    
    # silhouette score
    optimal_k_silhouette = np.argmax(silhouette_scores) + 2  
    
    # average
    optimal_k = int(np.mean([optimal_k_elbow, optimal_k_silhouette]))
    return optimal_k

def ml_analysis(image):

    image_np = np.array(image)
    pixels = image_np.reshape((-1, 3))
    
    optimal_k = determine_optimal_clusters(pixels)
    logging.info(f"Optimal number of clusters: {optimal_k}")
    
    # KMeans clustering
    kmeans = KMeans(n_clusters=optimal_k, random_state=42)
    kmeans.fit(pixels)
    labels = kmeans.labels_
    centers = kmeans.cluster_centers_
    
    # segmented image
    segmented_image = centers[labels].reshape(image_np.shape).astype(np.uint8)
    
    gray = cv2.cvtColor(segmented_image, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    cleaned_image = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
    
    # Overlay
    overlay = cv2.addWeighted(image_np, 0.7, cv2.cvtColor(cleaned_image, cv2.COLOR_GRAY2BGR), 0.3, 0)
    
    return segmented_image, cleaned_image, overlay