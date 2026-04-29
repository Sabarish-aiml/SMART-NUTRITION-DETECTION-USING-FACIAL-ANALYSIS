  const constructFormData = async () => {
    if (!imageSrc) return null;

    // Convert data URL to blob
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    const file = new File([blob], 'face.jpg', { type: blob.type });

    return file;
  };

  const handleAnalyze = async () => {
    if (!imageSrc) {
      alert('Please capture or upload an image first.');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const imageFile = await constructFormData();
      const formData = new FormData();
      formData.append('image', imageFile);

      const res = await axios.post('http://localhost:8000/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(res.data);
      if (addHistory) addHistory(res.data);

    } catch (err) {
      console.error(err);
      alert('Analysis failed');
    } finally {
      setLoading(false);
    }
  };
