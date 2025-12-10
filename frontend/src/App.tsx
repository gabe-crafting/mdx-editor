import {useState} from 'react';
import './App.css';
import {OpenFile, SaveFile, SaveFileAs} from "../wailsjs/go/main/App";

function App() {
    const [content, setContent] = useState('');
    const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);

    const handleOpen = async () => {
        try {
            const result = await OpenFile();
            if (result.filePath && result.content !== undefined) {
                setContent(result.content);
                setCurrentFilePath(result.filePath);
            }
        } catch (error) {
            console.error('Error opening file:', error);
            alert('Failed to open file: ' + error);
        }
    };

    const handleSave = async () => {
        if (!currentFilePath) {
            handleSaveAs();
            return;
        }
        try {
            await SaveFile(currentFilePath, content);
            alert('File saved successfully!');
        } catch (error) {
            console.error('Error saving file:', error);
            alert('Failed to save file: ' + error);
        }
    };

    const handleSaveAs = async () => {
        try {
            const filePath = await SaveFileAs(content);
            if (filePath) {
                setCurrentFilePath(filePath);
                alert('File saved successfully!');
            }
        } catch (error) {
            console.error('Error saving file:', error);
            alert('Failed to save file: ' + error);
        }
    };

    return (
        <div id="App">
            <div className="editor-container">
                <div className="toolbar">
                    <button className="btn" onClick={handleOpen}>Open</button>
                    <button className="btn" onClick={handleSave}>Save</button>
                    <button className="btn" onClick={handleSaveAs}>Save As</button>
                    {currentFilePath && (
                        <span className="file-path">{currentFilePath}</span>
                    )}
                </div>
                <textarea
                    className="editor-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start typing your MDX content here..."
                />
            </div>
        </div>
    )
}

export default App
