import { hallwayPublicCDNUrl, ModelType } from "@quarkworks-inc/avatar-webkit-rendering"

import emojiIcon from '../assets/emoji.png'
import mozillaIcon from '../assets/mozilla.png'
import hannahIcon from '../assets/hannah.png'
import kevinIcon from '../assets/kevin.png'

export class AvatarOptions {
  readonly id: string
  readonly name: string
  readonly thumbnail: string
  readonly modelType: ModelType
  readonly modelUrl?: string

  private constructor(id: string, name: string, thumbnail: string, modelType: ModelType, modelUrl?: string) {
    this.id = id
    this.name = name
    this.thumbnail = thumbnail
    this.modelType = modelType
    this.modelUrl = modelUrl
  }

  public static readonly emoji = new AvatarOptions('emoji', 'Mr. Emoji', emojiIcon, 'emoji')
  public static readonly mozilla = new AvatarOptions('mozilla', 'Mozilla', mozillaIcon, 'mozilla', hallwayPublicCDNUrl('models/mozilla.glb'))
  public static readonly rpmHannah = new AvatarOptions('rpm_hannah', 'ReadyPlayerMe (Hannah)', hannahIcon, 'readyPlayerMe', hallwayPublicCDNUrl('models/hannah.glb'))
  public static readonly rpmKevin = new AvatarOptions('rpm_kevin', 'ReadyPlayerMe (Kevin)', kevinIcon, 'readyPlayerMe', hallwayPublicCDNUrl('models/kevin.glb'))

  public static readonly all: AvatarOptions[] = [
    AvatarOptions.emoji, 
    AvatarOptions.mozilla, 
    AvatarOptions.rpmHannah,
    AvatarOptions.rpmKevin
  ]
}