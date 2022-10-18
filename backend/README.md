# Backend Setup
## Setup/start VENV and Install Requirements
### For Linux and Mac Users (this will create a virtual environment in the current directory, and install all the requirements, as well as activate the newly created VENV):
`python -m venv venv && pip install -r requirements.txt && source venv/bin/activate`

# Useful Commands
**Start Server**

`python manage.py runserver`

**Start Server On Specific Port**

`python manage.py runserver [port_number]`

**Create New App**

`python manage.py startapp [app_name]`

**Migrate All Changes**

`python manage.py makemigrations && python manage.py migrate`

**Create Superuser Account**

`python manage.py createsuperuser`

