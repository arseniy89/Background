onload = () => {
    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    particles = []
    properties = {
        bgColor: `rgba(17, 17, 19, 1)`,
        particleColor: `rgba(255, 40, 40, 1)`,
        particleRadius: 3,
        particleCount: innerWidth*innerHeight / 6500,
        particleMaxVelocity: 0.5,
        lineLength: 150,
        particleLife: 6
    }

    window.onresize = function () {
        canvas.width = innerWidth
        canvas.height = innerHeight
        properties.particleCount = innerWidth*innerHeight / 6500
    }


    class Particle {
        constructor () {
            this.x = Math.random()*canvas.width
            this.y = Math.random()*canvas.height
            this.velocityX = Math.random()*(properties.particleMaxVelocity*2) - properties.particleMaxVelocity
            this.velocityY = Math.random()*(properties.particleMaxVelocity*2) - properties.particleMaxVelocity
            this.origlife = Math.random()*properties.particleLife*60
            this.life = this.origlife
        }
        reCalculateLife (count, i) {
            if (this.life < 1) {
                if (properties.particleCount < count) {
                    particles.splice(i, 1)
                    return 1
                } else {
                    this.x = Math.random()*canvas.width
                    this.y = Math.random()*canvas.height
                    this.velocityX = Math.random()*(properties.particleMaxVelocity*2) - properties.particleMaxVelocity
                    this.velocityY = Math.random()*(properties.particleMaxVelocity*2) - properties.particleMaxVelocity
                    this.origlife = Math.random()*properties.particleLife*60
                    this.life = this.origlife
                    return 0
                }
            }
            return 0
        }
        position () {
            this.x + this.velocity > canvas.width && this.x + this.velocityX < 0 && this.velosityX < 0 ? this.velocityX*=-1 : this.velocity
            this.y + this.velocity > canvas.height && this.y + this.velocityY < 0 && this.velosityY < 0 ? this.velocityY*=-1 : this.velocity
            this.x += this.velocityX
            this.y += this.velocityY
        }
        reDraw () {
            properties.particleColor = `rgba(255, 40, 40, ${Math.min((--this.life)/60, (this.origlife - this.life)/60)})`
            ctx.beginPath()
            ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI*2)
            ctx.closePath()
            ctx.fillStyle = properties.particleColor
            ctx.fill()
        }
    }

    const reDrawBackground = () => {
        ctx.fillStyle = properties.bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const drawLines = () => {
        let x1, y1, x2, y2, length
        for (let i in particles) {
            for (let j in particles) {
                x1 = particles[i].x
                y1 = particles[i].y
                x2 = particles[j].x
                y2 = particles[j].y
                length = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2))
                if (length < properties.lineLength) {
                    ctx.lineWidth = '0.5'
                    ctx.strokeStyle = `rgba(255, 40, 40, ${1 - length/properties.lineLength})`
                    ctx.beginPath()
                    ctx.moveTo(x1, y1)
                    ctx.lineTo(x2, y2)
                    ctx.closePath()
                    ctx.stroke()
                }
            }
        }
    }

    const reDrawParticles = () => {
        let count = particles.length
        if (properties.particleCount > particles.length) {
            for (let i = 0; i < properties.particleCount-count; i++) {particles.push(new Particle)}
        }
        for (let i in particles) {
            if (particles[i].reCalculateLife(count, i) == 1) {--count}
            else {particles[i].position(); particles[i].reDraw()}
        }
    }

    const Animation = t => {
        reDrawBackground()
        reDrawParticles()
        drawLines()
        requestAnimationFrame(Animation)
    }

    Animation()
}
