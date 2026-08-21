import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [files, setFiles] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:3000/api/candidates');
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files || !jobDescription) return alert('Missing files or JD');

    setLoading(true);
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    
    Array.from(files).forEach(file => {
      formData.append('resumes', file);
    });

    try {
      await axios.post('http://127.0.0.1:3000/api/process', formData);
      setFiles(null);
      setJobDescription('');
      document.getElementById('file-input').value = '';
      fetchCandidates();
    } catch (err) {
      alert('Upload failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui', color: '#111' }}>
      <h1>Smart Resume Screener</h1>

      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <textarea
          placeholder="Paste Job Description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows="5"
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: '#000', backgroundColor: '#fff' }}
        />
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf"
          onChange={(e) => setFiles(e.target.files)}
          style={{ color: '#000' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {loading ? 'AI is Screening Resumes...' : 'Upload and Screen'}
        </button>
      </form>

      <h2>Candidate Dashboard</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {candidates.map((c) => (
          <div key={c._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>{c.fileName}</h3>
              <span style={{ background: c.score >= 70 ? '#d4edda' : '#f8d7da', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', color: '#000' }}>
                Score: {c.score}/100
              </span>
            </div>
            <p><strong>Matches:</strong> {c.matchingSkills?.join(', ') || 'None'}</p>
            <p><strong>Missing:</strong> {c.missingSkills?.join(', ') || 'None'}</p>
            <p><strong>Education:</strong> {c.education || 'Not specified'}</p>
            <p><strong>Experience:</strong> {c.experience || 'Not specified'}</p>
            <p style={{ color: '#444', lineHeight: '1.5' }}>{c.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}