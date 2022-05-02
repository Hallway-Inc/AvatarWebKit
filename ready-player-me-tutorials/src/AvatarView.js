import React from 'react';
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import { AUPredictor, BlendShapeKeys } from '@quarkworks-inc/avatar-webkit'

const navigationBarHeight = 100
const backgroundUrl = "https://hallway-public.nyc3.cdn.digitaloceanspaces.com/backgrounds/venice_sunset_1k.hdr"
const SCALE = 7.5

export class AvatarView extends React.Component {
    mainViewRef = React.createRef()
    predictor = new AUPredictor({
        apiToken: '110546ae-627f-48d4-9cf8-fd8850e0ac7f',
        shouldMirrorOutput: true
    })

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

        // We will use the lighting from the background instead of creating our own
        const background = await this.loadBackground(backgroundUrl, this.renderer)
        this.scene = new THREE.Scene()
        this.scene.environment = background
        this.scene.background = background

        this.loadModel()

        this.renderer.setAnimationLoop(this.renderScene.bind(this))

        this.predictor.onPredict = this.onPredict.bind(this)
    }

    onPredict = (results) => {
        const head = this.avatar.children.find((child) => child.name === "Wolf3D_Avatar")

        Object.entries(results.blendShapes).forEach(function([key, value]) {
            const arKitKey = BlendShapeKeys.toARKitConvention(key)

            const index = head.morphTargetDictionary[arKitKey]
            head.morphTargetInfluences[index] = value
        })

        const {
            pitch,
            yaw,
            roll,
        } = results.rotation

        this.avatar?.rotation.set(-pitch, yaw, roll)

        const {
            x,
            y,
            z
        } = results.transform

        this.avatar.position.set(x * SCALE, -4 + y * SCALE, z)
    }
    
    async componentDidUpdate(oldProps) {
        if(this.props?.avatarUrl && this.props?.avatarUrl !== oldProps?.avatarUrl) {
            this.loadModel()
        }
        
        if(this.props?.predicting !== oldProps?.predicting) {
            if(this.props?.predicting && this.predictor.state === 'stopped') {
                let stream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 360 },
                        facingMode: 'user'
                    }
                })

                await this.predictor.start({stream})
            } else if(this.predictor.state !== 'stopped') {
                await this.predictor.stop()
            }    
        }

        this.renderer.domElement.style.cssText = `display: ${!this.props.showIFrame ? 'block': 'none'}`
    }

    async loadModel() {
        const gltf = await this.loadGLTF(this.props.avatarUrl)
        this.avatar = gltf.scene.children[0]
        this.avatar.position.set(0, -4, 0)
        this.avatar.scale.setScalar(SCALE)

        this.scene.add(this.avatar)
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