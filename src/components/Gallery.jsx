const Gallery = ({ images }) => {
    return (
        <div className="gallery">
            <h1>Gallery</h1>
            <h3>Cats you've seen :O</h3>
            <div className="image-container">
                {images && images.length > 0 ? (
                    images.map((image, index) => (
                        <div key={index}>
                            <img src={image} alt={`Cat ${index + 1}`} />
                        </div>
                    ))
                ) : (
                    <div>
                        <h3>Empty so far :&#40;</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
