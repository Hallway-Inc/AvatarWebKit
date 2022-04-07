import { hallwayPublicCDNUrl } from "@quarkworks-inc/avatar-webkit-rendering"

export class BackgroundOptions {
  readonly id: string
  readonly name: string
  // readonly thumbnail: string
  readonly url: string
  readonly size: string

  private constructor(id: string, name: string, url: string, size: string) {
    this.id = id
    this.name = name
    this.url = url
    this.size = size
  }

  // 1k HDRs
  static readonly venice_sunset_1k = new BackgroundOptions("venice_sunset_1k", "Venice Sunset (1k)", hallwayPublicCDNUrl('backgrounds/venice_sunset_1k.hdr'), '1.3 MB')
  static readonly aerodynamics_workshop_1k = new BackgroundOptions("aerodynamics_workshop_1k", "Aerodynamics Workshop (1k)", hallwayPublicCDNUrl('backgrounds/aerodynamics_workshop_1k.hdr'), '1.4 MB')
  static readonly missle_launch_facility_1k = new BackgroundOptions("missle_launch_facility_1k", "Missle Launch Facility (1k)", hallwayPublicCDNUrl('backgrounds/missle_launch_facility_1k.hdr'), '1.6 MB')

  // 4k EXRs
  // Sorted by size increasing
  static readonly aerodynamics_workshop_4k = new BackgroundOptions("aerodynamics_workshop_4k", "Aerodynamics Workshop (4k)", hallwayPublicCDNUrl('backgrounds/aerodynamics_workshop_4k.exr'), '18.6 MB')
  static readonly small_cathedral_4k = new BackgroundOptions("small_cathedral_4k", "Small Cathedral (4k)", hallwayPublicCDNUrl('backgrounds/small_cathedral_02_4k.exr'), '18.8 MB')
  static readonly spruit_sunrise_4k = new BackgroundOptions("spruit_sunrise_4k", "Spruit Sunrise (4k)", hallwayPublicCDNUrl('backgrounds/spruit_sunrise_4k.exr'), '20.1 MB')
  static readonly konzerthaus_4k = new BackgroundOptions("konzerthaus_4k", "Konzerthaus (4k)", hallwayPublicCDNUrl('backgrounds/konzerthaus_4k.exr'), '21.0 MB')
  static readonly teufelsberg_lookout_4k = new BackgroundOptions("teufelsberg_lookout_4k", "Teufelsberg Lookout (4k)", hallwayPublicCDNUrl('backgrounds/teufelsberg_lookout_4k.exr'), '24.1 MB')
  static readonly blaubeuren_church_square_4k = new BackgroundOptions("blaubeuren_church_square_4k", "Blaubeuren Church Square (4k)", hallwayPublicCDNUrl('backgrounds/blaubeuren_church_square_4k.exr'), '83.7 MB')
  static readonly phalzer_forest_4k = new BackgroundOptions("phalzer_forest_4k", "Phalzer Forest (4k)", hallwayPublicCDNUrl('backgrounds/phalzer_forest_01_4k.exr'), '88.7 MB')

  // Collections
  static readonly all_1k: BackgroundOptions[] = [this.venice_sunset_1k, this.aerodynamics_workshop_1k, this.missle_launch_facility_1k]
  static readonly all_4k: BackgroundOptions[] = [this.aerodynamics_workshop_4k, this.small_cathedral_4k, this.spruit_sunrise_4k, this.konzerthaus_4k, this.teufelsberg_lookout_4k, this.blaubeuren_church_square_4k, this.phalzer_forest_4k]
  static readonly all: BackgroundOptions[] = [...this.all_1k, ...this.all_4k]
}