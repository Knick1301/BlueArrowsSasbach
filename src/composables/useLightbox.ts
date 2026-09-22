import { ref } from 'vue'

export interface LightboxImage {
  src: string
  alt?: string
}

const images = ref<LightboxImage[]>([])
const currentIndex = ref(0)
const isOpen = ref(false)

const open = (input: LightboxImage[] | LightboxImage | string, index = 0) => {
  if (typeof input === 'string') {
    images.value = [{ src: input }]
  } else if (Array.isArray(input)) {
    images.value = input
  } else {
    images.value = [input]
  }
  currentIndex.value = index
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const next = () => {
  if (images.value.length) {
    currentIndex.value = (currentIndex.value + 1) % images.value.length
  }
}

const prev = () => {
  if (images.value.length) {
    currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length
  }
}

export function useLightbox() {
  return { images, currentIndex, isOpen, open, close, next, prev }
}
