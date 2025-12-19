


<p align="center"><img src="https://github.com/subhilogix/mood-study-planner/blob/30b0df9fe3691001f718a104f7adad544b0f0a41/screenshot.jpg" alt="project-image"></p>
<p id="description">MindStudy is a mood-aware study companion that helps students manage their mental well-being while staying productive.
It lets users track their emotions, maintain a journal, organize daily tasks, and visualize their progress over time.
By combining emotional awareness with planning features, MindStudy encourages healthy study habits, self-reflection, and balance instead of burnout.</p>


<h2>🧐 Features</h2>

Here're some of the project's best features:
<ul>
<li>Mood Tracking</li>
<li>Emotion Analysis</li>
<li>Personal Journaling</li>
<li>Task & Study Planner</li>
<li>Google Calendar Integration</li>
<li>Track emotional changes</li>  
<li>AI Study Companion (Chat-based)</li>
<li>Student-Friendly UX</li>
</ul>

# How to Set Up it?

The following instructions were tested on the Windows and Linux with Python 3.13.

1. Clone this repository

```
git clone https://github.com/subhilogix/mood-study-planner.git
```
```
cd mood-study-planner
```

BACKEND

```
cd backend
```

2. Create and activate virtual environment 

```
python -m venv venv
```
on Linux system
```
source venv/bin/activate
```
on Windows system
```
.\venv\Scripts\activate.bat
```
3. Install requirements

```
pip install  -r requirements.txt
```

4. Run the 
```
uvicorn app.main:app --reload --port 8000

```
FRONTEND 
```
cd frontend
```
1. Install requirements

```
npm install
```
2. Run the 

```
npm run dev

```
