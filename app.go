package main

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// OpenFileResult represents the result of opening a file
type OpenFileResult struct {
	FilePath string `json:"filePath"`
	Content  string `json:"content"`
}

// FileHistoryItem represents a file in the history
type FileHistoryItem struct {
	FilePath  string `json:"filePath"`
	Timestamp int64  `json:"timestamp"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// OpenFile opens a file dialog and returns the file path and content
func (a *App) OpenFile() (*OpenFileResult, error) {
	filePath, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Open MDX File",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "MDX Files (*.mdx)",
				Pattern:     "*.mdx",
			},
			{
				DisplayName: "Markdown Files (*.md)",
				Pattern:     "*.md",
			},
			{
				DisplayName: "All Files (*.*)",
				Pattern:     "*.*",
			},
		},
	})
	if err != nil {
		return nil, err
	}

	if filePath == "" {
		return &OpenFileResult{}, nil
	}

	content, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	return &OpenFileResult{
		FilePath: filePath,
		Content:  string(content),
	}, nil
}

// SaveFile saves content to the given file path
func (a *App) SaveFile(filePath string, content string) error {
	return os.WriteFile(filePath, []byte(content), 0644)
}

// SaveFileAs opens a save file dialog and saves the content
func (a *App) SaveFileAs(content string) (string, error) {
	filePath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Save MDX File",
		DefaultFilename: "untitled.mdx",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "MDX Files (*.mdx)",
				Pattern:     "*.mdx",
			},
			{
				DisplayName: "Markdown Files (*.md)",
				Pattern:     "*.md",
			},
			{
				DisplayName: "All Files (*.*)",
				Pattern:     "*.*",
			},
		},
	})
	if err != nil {
		return "", err
	}

	if filePath == "" {
		return "", nil
	}

	err = os.WriteFile(filePath, []byte(content), 0644)
	if err != nil {
		return "", err
	}

	return filePath, nil
}

// ReadFile reads a file from the given path and returns its content
func (a *App) ReadFile(filePath string) (string, error) {
	content, err := os.ReadFile(filePath)
	if err != nil {
		return "", err
	}
	return string(content), nil
}

// getHistoryFilePath returns the path to the file history storage file
func (a *App) getHistoryFilePath() (string, error) {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}

	appDir := filepath.Join(configDir, "mdxEditor")
	// Create directory if it doesn't exist
	if err := os.MkdirAll(appDir, 0755); err != nil {
		return "", err
	}

	return filepath.Join(appDir, "file-history.json"), nil
}

// LoadFileHistory loads the file history from disk
func (a *App) LoadFileHistory() ([]FileHistoryItem, error) {
	historyPath, err := a.getHistoryFilePath()
	if err != nil {
		return []FileHistoryItem{}, nil // Return empty history if we can't get path
	}

	data, err := os.ReadFile(historyPath)
	if err != nil {
		if os.IsNotExist(err) {
			return []FileHistoryItem{}, nil // File doesn't exist yet, return empty history
		}
		return nil, err
	}

	var history []FileHistoryItem
	if err := json.Unmarshal(data, &history); err != nil {
		return []FileHistoryItem{}, nil // If JSON is invalid, return empty history
	}

	return history, nil
}

// SaveFileHistory saves the file history to disk
func (a *App) SaveFileHistory(history []FileHistoryItem) error {
	historyPath, err := a.getHistoryFilePath()
	if err != nil {
		return err
	}

	data, err := json.MarshalIndent(history, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(historyPath, data, 0644)
}
