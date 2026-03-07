<template>
  <Teleport to="body">
    <div
      class="sekai-background-wrap"
      :style="wrapperStyle"
    >
      <canvas ref="canvasRef" class="sekai-background" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  bgOpacity?: number
}

const props = withDefaults(defineProps<Props>(), {
  bgOpacity: 0.25,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)

const wrapperStyle = computed(() => ({
  '--bg-opacity': props.bgOpacity,
}))

const PINK = 'rgba(255, 186, 241, '
const YELLOW = 'rgba(255, 247, 148, '
const AQUA = 'rgba(149, 253, 255, '

class PieceOfSekai {
  x = 0
  y = 0
  size = 0
  speedX = 0
  speedY = 0
  rotation = 0
  rotationSpeed = 0
  opacity = 0
  age = 0
  vertex1Y = 0
  vertex2X = 0
  vertex3X = 0

  fadeInDuration = 2500
  fullOpacityDuration = 2000 * (2 + Math.random() * 4)
  fadeOutDuration = 2500
  lifetime = this.fadeInDuration + this.fullOpacityDuration + this.fadeOutDuration

  color = ''

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D
  ) {
    this.reset()
  }

  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = Math.random() * this.canvas.height
    this.size = 20 + Math.random() * 60
    this.speedX = (Math.random() - 0.5) * 0.5
    this.speedY = (Math.random() - 0.5) * 0.5
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.02
    this.opacity = 0
    this.age = 0
    this.color = getColor()

    this.vertex1Y = -(this.size / 6 + Math.random() * this.size * 0.7)
    this.vertex2X = -(this.size / 3 + Math.random() * this.size * 0.9)
    this.vertex3X = this.size / 8 + Math.random() * this.size * 0.5
  }

  update(deltaTime: number) {
    this.x += this.speedX
    this.y += this.speedY
    this.rotation += this.rotationSpeed
    this.age += deltaTime

    if (this.age < this.fadeInDuration) {
      this.opacity = this.age / this.fadeInDuration
    } else if (this.age < this.fadeInDuration + this.fullOpacityDuration) {
      this.opacity = 1
    } else if (this.age < this.lifetime) {
      const progress =
        (this.age - this.fadeInDuration - this.fullOpacityDuration) / this.fadeOutDuration
      this.opacity = 1 - progress
    }

    if (this.age >= this.lifetime) {
      this.reset()
    }
  }

  draw() {
    this.ctx.save()
    this.ctx.translate(this.x, this.y)
    this.ctx.rotate(this.rotation)
    this.ctx.globalAlpha = this.opacity

    this.ctx.beginPath()
    this.ctx.moveTo(0, this.vertex1Y)
    this.ctx.lineTo(this.vertex2X, this.size / 2)
    this.ctx.lineTo(this.vertex3X, this.size / 2)
    this.ctx.closePath()

    this.ctx.fillStyle = `${this.color + this.opacity})`
    this.ctx.fill()

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    this.ctx.lineWidth = 2
    this.ctx.stroke()

    this.ctx.restore()
  }
}

const getColor = () => {
  const colorIndex = Math.floor(Math.random() * 3)
  switch (colorIndex) {
    case 0:
      return PINK
    case 1:
      return YELLOW
    default:
      return AQUA
  }
}

let animationFrameId: number | null = null

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resize()
  window.addEventListener('resize', resize)

  const pieces: PieceOfSekai[] = []
  const pieceCount = 39
  for (let i = 0; i < pieceCount; i++) {
    const piece = new PieceOfSekai(canvas, ctx)
    piece.age = Math.random() ** 2 * piece.lifetime
    pieces.push(piece)
  }

  let lastTime = 0

  const animate = (time: number) => {
    const delta = time - lastTime
    lastTime = time

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    pieces.forEach((piece) => {
      piece.update(delta)
      piece.draw()
    })

    animationFrameId = requestAnimationFrame(animate)
  }

  animate(0)

  onUnmounted(() => {
    window.removeEventListener('resize', resize)
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
  })
})
</script>

<style scoped>
.sekai-background-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.sekai-background {
  width: 100%;
  height: 100%;
  opacity: var(--bg-opacity);
  pointer-events: none;
}
</style>
