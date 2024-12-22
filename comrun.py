import subprocess
import os
import re

def run_git_command(command):
    """Run a Git command and return the output."""
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
    if result.returncode != 0:
        print(f"Error running command: {command}\n{result.stderr}")
        return None
    return result.stdout.strip()

def split_large_commits():
    # Get all commits with their file changes
    log_output = run_git_command('git log --pretty=format:"%H|%an|%ae|%ad" --name-only')
    if not log_output:
        return
    
    # Parse commits
    commits = []
    for line in log_output.splitlines():
        if "|" in line:  # Commit metadata
            hash_, author, email, date = line.split("|")
            commits.append({"hash": hash_, "author": author, "email": email, "date": date, "files": []})
        elif line:  # File path
            commits[-1]["files"].append(line)

    # Process each commit
    for commit in commits:
        if len(commit["files"]) <= 7:
            print(f"Skipping commit {commit['hash']} (only {len(commit['files'])} files).")
            continue
        
        print(f"Processing commit {commit['hash']} ({len(commit['files'])} files).")
        run_git_command(f"git checkout {commit['hash']}^ --quiet")  # Checkout parent commit
        
        # Split files into smaller groups
        for i in range(0, len(commit["files"]), 7):
            files_to_add = commit["files"][i:i+7]
            for file in files_to_add:
                run_git_command(f"git add {file}")
            
            # Commit with original author and date
            commit_message = f"Split from {commit['hash']}"
            git_env = f'GIT_AUTHOR_NAME="{commit["author"]}" GIT_AUTHOR_EMAIL="{commit["email"]}" GIT_AUTHOR_DATE="{commit["date"]}"'
            run_git_command(f'{git_env} git commit -m "{commit_message}"')
        
        print(f"Commit {commit['hash']} split into {len(commit['files']) // 7 + 1} smaller commits.")

# Run the script
if __name__ == "__main__":
    split_large_commits()
