import base64
import requests
from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# PostgreSQL connection (change your credentials if needed)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Dilturupam%402003@localhost:5432/skill_swap '
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ImgBB API Key
IMGBB_API_KEY = '2b26ac3b230e50aede51f04a035e43d2'

# ---------------------- MODELS ---------------------- #
class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(150))
    skills_offered = db.Column(db.Text)
    skills_wanted = db.Column(db.Text)
    availability = db.Column(db.String(100))
    is_public = db.Column(db.Boolean, default=True)
    profile_photo = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

# ---------------------- HELPERS ---------------------- #
def upload_to_imgbb(image_file):
    url = "https://api.imgbb.com/1/upload"
    encoded_image = base64.b64encode(image_file.read())
    payload = {
        "key": IMGBB_API_KEY,
        "image": encoded_image
    }
    response = requests.post(url, data=payload)
    if response.status_code == 200:
        return response.json()['data']['url']
    return None

# ---------------------- ROUTES ---------------------- #
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        location = request.form.get('location')
        availability = request.form.get('availability')
        is_public = request.form.get('is_public') == 'on'
        skills_offered = request.form.get('skills_offered')
        skills_wanted = request.form.get('skills_wanted')
        photo = request.files.get('profile_photo')

        if password != confirm_password:
            flash("Passwords do not match.")
            return redirect(url_for('signup'))

        if User.query.filter_by(email=email).first():
            flash("Email already exists.")
            return redirect(url_for('signup'))

        image_url = upload_to_imgbb(photo) if photo else None

        new_user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password_hash=generate_password_hash(password),
            location=location,
            availability=availability,
            is_public=is_public,
            skills_offered=skills_offered,
            skills_wanted=skills_wanted,
            profile_photo=image_url
        )
        db.session.add(new_user)
        db.session.commit()

        flash("Registration successful! Please log in.")
        return redirect(url_for('signin'))

    return render_template('Signup.html')

@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.user_id
            flash("Login successful.")
            return redirect(url_for('profile'))
        else:
            flash("Invalid email or password.")
            return redirect(url_for('signin'))

    return render_template('Signin.html')

@app.route('/profile')
def profile():
    user_id = session.get('user_id')
    if not user_id:
        flash("Please login to access your profile.")
        return redirect(url_for('signin'))

    user = User.query.get(user_id)
    return render_template('Profile.html', user=user)

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    flash("Logged out successfully.")
    return redirect(url_for('signin'))

# ---------------------- RUN APP ---------------------- #
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
