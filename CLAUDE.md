# CLAUDE.md - AI Assistant Guide for NobleFrame

This document provides guidance for AI assistants working with the NobleFrame codebase.

## Project Overview

**Project Name:** NobleFrame
**Status:** Initial Development Phase
**Repository:** Nicozrm/NobleFrame

NobleFrame is a newly initialized project. The codebase is in its early stages and will evolve as development progresses.

## Repository Structure

```
NobleFrame/
├── README.md          # Project overview and documentation
├── CLAUDE.md          # AI assistant guidelines (this file)
└── .git/              # Git repository metadata
```

### Current State

This is a fresh repository with minimal setup. As the project grows, this document should be updated to reflect:
- New directories and their purposes
- Source code organization
- Configuration files
- Build artifacts and outputs

## Development Workflow

### Git Conventions

**Branch Naming:**
- Feature branches: `feature/<description>`
- Bug fixes: `fix/<description>`
- Documentation: `docs/<description>`
- Claude AI branches: `claude/<description>-<session-id>`

**Commit Messages:**
- Use clear, descriptive commit messages
- Start with a verb in imperative mood (Add, Fix, Update, Remove)
- Keep the first line under 72 characters
- Reference issues when applicable

**Example:**
```
Add user authentication module

- Implement JWT-based authentication
- Add login/logout endpoints
- Include password hashing utilities

Closes #123
```

### Pull Requests

- Provide a clear description of changes
- Link related issues
- Ensure all tests pass before requesting review
- Keep PRs focused on a single concern

## Coding Conventions

### General Guidelines

1. **Code Quality:**
   - Write clean, readable code
   - Follow language-specific best practices
   - Keep functions small and focused
   - Use meaningful variable and function names

2. **Documentation:**
   - Document public APIs and complex logic
   - Keep comments concise and up-to-date
   - Update README.md when adding new features

3. **Testing:**
   - Write tests for new functionality
   - Maintain existing test coverage
   - Run tests before committing

### Security Considerations

- Never commit sensitive data (API keys, passwords, credentials)
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP security guidelines

## AI Assistant Guidelines

### When Working on This Codebase

1. **Understand First:**
   - Read relevant files before making changes
   - Understand the existing code structure
   - Check for related code that might be affected

2. **Make Minimal Changes:**
   - Only change what is necessary
   - Avoid unnecessary refactoring
   - Keep solutions simple and focused

3. **Maintain Consistency:**
   - Follow existing code patterns and styles
   - Use consistent naming conventions
   - Match the formatting of surrounding code

4. **Test Changes:**
   - Run existing tests after modifications
   - Verify changes work as expected
   - Check for unintended side effects

### Things to Avoid

- Adding unnecessary dependencies
- Over-engineering simple solutions
- Making changes without reading existing code
- Introducing security vulnerabilities
- Breaking existing functionality

## Project Setup

### Prerequisites

*(To be defined as the project develops)*

### Installation

```bash
git clone <repository-url>
cd NobleFrame
# Additional setup steps will be added as the project evolves
```

### Running the Project

*(Commands will be added once the project structure is established)*

### Running Tests

*(Test commands will be documented when testing infrastructure is set up)*

## Architecture

*(Architecture documentation will be added as the project structure develops)*

### Key Components

*(To be documented as components are created)*

### Data Flow

*(To be documented as the application architecture is defined)*

## Configuration

*(Configuration documentation will be added when config files are introduced)*

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| *(To be defined)* | | | |

## Dependencies

*(Dependencies will be documented when package management is set up)*

## Troubleshooting

### Common Issues

*(Common issues and solutions will be documented as they arise)*

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write or update tests
5. Submit a pull request

## Useful Commands

*(Frequently used commands will be added as the project develops)*

```bash
# Git commands
git status                    # Check repository status
git log --oneline -10         # View recent commits
git diff                      # View unstaged changes
```

## Contact

**Maintainer:** Nicozrm

---

*Last updated: January 2026*

*Note: This document should be updated as the project evolves to reflect the current state of the codebase, new conventions, and additional guidelines for AI assistants.*
