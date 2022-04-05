import React from 'react';
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"

const navigationBarHeight = 100
const backgroundUrl = "https://hallway-public.nyc3.cdn.digitaloceanspaces.com/backgrounds/venice_sunset_1k.hdr"

export class AvatarView extends React.Component {
    mainViewRef = React.createRef()

    async componentDidMount() {
        const mainView = this.mainViewRef.current

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight - navigationBarHeight)
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping

        mainView.appendChild(this.renderer.domElement)

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight - navigationBarHeight), 0.1, 1000)
        this.camera.position.set(0, 0, 3)
  
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.loadModel()

        // We will use the lighting from the background instead of creating our own
        const background = await this.loadBackground(backgroundUrl, this.renderer)
        this.scene = new THREE.Scene()
        this.scene.environment = background
        this.scene.background = background

        this.renderer.setAnimationLoop(this.renderScene.bind(this))
    }
    
    componentDidUpdate(props, oldProps) {
        if(props?.avatarUrl && props?.avatarUrl !== oldProps?.avatarUrl) {
            this.loadModel()
        }

        this.renderer.domElement.style.cssText = `display: ${!this.props.showIFrame ? 'block': 'none'}`
    }

    async loadModel() {
        const gltf = await this.loadGLTF(this.props.avatarUrl)
        const avatar = gltf.scene
        avatar.position.set(0, -0.55, 0)

        const group = new THREE.Group()
        group.add(avatar)
        group.scale.setScalar(7.5)

        this.scene.add(group)
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera)
    }

    loadGLTF(url) {
        return new Promise((resolve) => {
            const loader = new GLTFLoader()
            loader.load(url, (gltf) => resolve(gltf))
        })
    }

    loadBackground(url, renderer) {
        return new Promise((resolve) => {
            const loader = new RGBELoader()
            const generator = new THREE.PMREMGenerator(renderer)
            loader.load(url, (texture) => {
                const envMap = generator.fromEquirectangular(texture).texture

                generator.dispose()
                texture.dispose()
                resolve(envMap)
            })
        })
    }
    
    render = () => (
        <div
            ref={this.mainViewRef}
            className="avatarView"
            style={{
                display: `${!this.props.showIFrame ? 'block': 'none'}`
            }}  
        />
    )
}