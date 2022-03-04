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
    this.pairs = [
        new PairOfBarriers(height, gap, width),
        new PairOfBarriers(height, gap, width + distance),
        new PairOfBarriers(height, gap, width + distance * 2),
        new PairOfBarriers(height, gap, width + distance * 3)
    ]

    const displacement = 3
    this.animate = () => {
        this.pairs.forEach(par => {
            par.setX(par.getX() - displacement)

            if (par.getX() < -par.getWidth()) {
                par.setX(par.getX() + distance * this.pairs.length)
                par.sortAberture()
            }
            const mid = width / 2
            const crossMiddle = par.getX() + displacement >= mid
                && par.getX() < mid
            if (crossMiddle) notifyPoint()
        })
    }
}

function Bird(gameHeight) {
    let flying = false

    this.element = newElement('img', 'passaro')
    this.element.src = 'imgs/passaro.png'

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`

    window.onkeydown = e => flying = true
    window.onkeyup = e => flying = false

    this.animateFly = () => {
        const newY = this.getY() + (flying ? 6 : -5)
        const maxHeightFly = gameHeight - this.element.clientHeight
    
        if(newY <= 0) {
            this.setY(0)
        } else if (newY >= maxHeightFly) {
            this.setY(maxHeightFly)
        } else {
            this.setY(newY)
        }
    }

    this.setY(gameHeight / 2)
}

function Progress() {
    this.element = newElement('span', 'progresso')
    this.attPoints = points => {
        this.element.innerHTML = points
    }
    this.attPoints(0)
}

function collision(elementA, elementB) {
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()

    const horizontal = a.right >= b.left
        && b.right >= a.left
    
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top

    return horizontal && vertical
}

function collided(bird, barriers) {
    let collided = false
    barriers.pairs.forEach(pair => {
        if(!collided) {
            const superior = pair.superior.element
            const inferior = pair.inferior.element
            collided = collision(bird.element, superior) || collision(bird.element, inferior)
        }
    })
    return collided
}

function FlappyBird() {
    let points = 0

    const gameArea = document.querySelector('[wm-flappy]')
    const height = gameArea.clientHeight
    const width = gameArea.clientWidth

    const progress = new Progress()
    const barriers = new Barriers(650, 1100, 200, 400, () => {
        progress.attPoints(++points)
    })
    const bird = new Bird(height)

    gameArea.appendChild(progress.element)
    gameArea.appendChild(bird.element)
    barriers.pairs.forEach(pair => gameArea.appendChild(pair.element))

    this.start = () => {
        const timer = setInterval(() => {
            barriers.animate()
            bird.animateFly()

            if(collided(bird, barriers)) {
                clearInterval(timer)
                // document.location.reload(true)
            }
        }, 20)
    }
}

new FlappyBird().start()