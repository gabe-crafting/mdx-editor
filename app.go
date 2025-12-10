package main

import (
	"context"
	"os"

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
