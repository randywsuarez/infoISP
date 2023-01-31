// import axios from 'axios'

import pdfMake from "pdfmake"
import vfs_fonts from "pdfmake/build/vfs_fonts"
export default ({ Vue }) => {
  pdfMake.vfs = vfs_fonts.pdfMake.vfs
  Vue.prototype.$pdfMake = pdfMake
}
