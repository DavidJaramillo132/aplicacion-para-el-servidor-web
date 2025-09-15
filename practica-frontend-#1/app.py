from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/contacto')
def contacto():
    return render_template('contacto.html')

@app.route('/Reserva')
def Reserva():
    return render_template('Reserva.html')
@app.route('/filaVirtual')
def filaVirtual():
    return render_template('filaVirtual.html')

if __name__ == '__main__':
    app.run(debug=True)
