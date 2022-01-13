function newElement(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barrier(reverse = false) {
    this.element = newElement('div', 'barreira')

    const border = newElement('div', 'borda')
    const tube = newElement('div', 'tubo')
    this.element.appendChild(reverse ? tube : border)
    this.element.appendChild(reverse ? border : tube)

    this.setHeight = height => tube.style.height = `${height}px`
}

function PairOfBarriers(height, aberture, x) {
    this.element = newElement('div', 'par-de-barreiras')

    this.superior = new Barrier(true)
    this.inferior = new Barrier(false)

    this.element.appendChild(this.superior.element)
    this.element.appendChild(this.inferior.element)

    this.sortAberture = () => {
        const heightAtop = Math.random() * (height - aberture)
        const heightUnder = height - aberture - heightAtop
        this.superior.setHeight(heightAtop)
        this.inferior.setHeight(heightUnder)
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = () => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.sortAberture()
    this.setX(x)
}

const b = new PairOfBarriers(650, 200, 400)
document.querySelector('[wm-flappy]').appendChild(b.element)