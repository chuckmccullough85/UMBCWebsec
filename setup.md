# Setup Guide for TCPRG4005 - Secure Programming Course

This guide provides setup instructions for students who want to run the course materials locally. **Note**: All course content is also available directly from the GitHub repository at [chuckmccullough85/UMBCWebSec](https://github.com/chuckmccullough85/UMBCWebSec) without local installation.

## Quick Start (Recommended)

You can access all course materials directly from GitHub without any local setup:
- Browse slides and materials online
- View Jupyter notebooks in GitHub's notebook viewer
- Copy code examples as needed

## Local Setup (Optional)

If you prefer to run exercises locally and interact with Jupyter notebooks:

### Required Tools

1. **Git** - Version control to clone the repository
   - Download: [git-scm.com](https://git-scm.com/)
   - Verify: `git --version`

2. **Python 3.8+** - Core language for exercises
   - Download: [python.org](https://www.python.org/downloads/)
   - Verify: `python --version`

3. **Visual Studio Code** - Recommended code editor
   - Download: [code.visualstudio.com](https://code.visualstudio.com/)
   - Verify: `code --version`

### Recommended VS Code Extensions

Install these extensions for the best experience:
- **Python Extension Pack** - Python development support
- **Jupyter** - Notebook support in VS Code
- **Markdown All in One** - Enhanced markdown editing
- **GitLens** - Git integration and history

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/chuckmccullough85/UMBCWebSec.git
   cd UMBCWebSec
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # Activate virtual environment:
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify setup:**
   ```bash
   python --version
   jupyter --version
   ```

### Running the Materials

- **Jupyter Notebooks**: Open in VS Code or run `jupyter notebook` in terminal
- **Flask Labs**: Navigate to `chapter7/chapter7_flask_labs/` and follow the README
- **Slides**: View markdown files in VS Code or any markdown viewer

### System Requirements

- **OS**: Windows 10+, macOS 10.14+, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Network**: Internet connection for package installation

### Troubleshooting

**Python not found**: Ensure Python is in your system PATH
**Permission errors**: Run terminal as administrator (Windows) or use `sudo` (macOS/Linux)
**Package conflicts**: Use a virtual environment to isolate dependencies

---

**Need help?** All materials work perfectly from the GitHub repository without local setup. Local installation is purely optional for interactive exercises.
