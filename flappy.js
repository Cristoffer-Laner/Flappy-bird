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
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.sortAberture()
    this.setX(x)
}

function Barriers(height, width, gap, distance, notifyPoint) {
    this.pares = [
        new PairOfBarriers(height, gap, width),
        new PairOfBarriers(height, gap, width + distance),
        new PairOfBarriers(height, gap, width + distance * 2),
        new PairOfBarriers(height, gap, width + distance * 3)
    ]

    const displacement = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - displacement)

            if (par.getX() < -par.getWidth()) {
                par.setX(par.getX() + distance * this.pares.length)
                par.sortAberture()
            }
        })

        const mid = width / 2
        const crossMiddle = par.getX() + displacement >= mid
            && par.getX() < mid
        if (crossMiddle) notifyPoint()
    }
}

const barriers = new Barriers(650, 1100, 200, 400)
const areaDoJogo = document.querySelector('[wm-flappy]')
barriers.pares.forEach(par => areaDoJogo.appendChild(par.element))
setInterval(() => {
    barriers.animar()
}, 20)
