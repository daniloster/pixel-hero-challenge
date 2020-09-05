import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'

// const className = new CSS('player')
// className.scope('animation: fly-stand 0.8s ease infinite;')
// className.scope(
//   '> g',
//   'box-shadow: 2px 2px 50px -16px rgba(0,0,0,0.75), -2px -2px 50px -16px rgba(0,0,0,0.75);',
// )
// className.scope('> g', 'animation: fly-move 0.6s linear infinite;')
const className = new CSS('player')
className.modifier('.shake', 'animation: shake 0.5s ease infinite;')
className.scope('padding: 0.2rem; height: 100%; width: 100%;')
className.scope('> div', 'background-color: yellow; width: 100%; height: 100%;')

const ns = 'http://www.w3.org/2000/svg'
export default function Player({ isBlackPower = false }) {
  return new Component('div', {
    // html: true,
    className,
    children: [new Component('div')],
    //   `
    // <svg class="${className}" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com">
    //   <defs>
    //     <linearGradient id="color-0" bx:pinned="true">
    //       <stop style="stop-color: rgb(77, 28, 4);"></stop>
    //     </linearGradient>
    //     <linearGradient gradientUnits="userSpaceOnUse" x1="129.576" y1="65.108" x2="129.576" y2="66.244" id="gradient-3" gradientTransform="matrix(1, 0, 0, 1, 2.751241, 0.729039)">
    //       <stop offset="0" style="stop-color: rgba(255, 255, 255, 1)"></stop>
    //       <stop offset="1" style="stop-color: rgba(204, 204, 204, 1)"></stop>
    //     </linearGradient>
    //     <linearGradient gradientUnits="userSpaceOnUse" x1="133.292" y1="65.108" x2="133.292" y2="66.244" id="gradient-4" gradientTransform="matrix(1, 0, 0, 1, 0.626025, 0.248668)">
    //       <stop offset="0" style="stop-color: rgba(255, 255, 255, 1)"></stop>
    //       <stop offset="1" style="stop-color: rgba(204, 204, 204, 1)"></stop>
    //     </linearGradient>
    //     <linearGradient id="gradient-2" bx:pinned="true">
    //       <stop offset="0" style="stop-color: rgba(101, 56, 0, 0.92);"></stop>
    //       <stop style="stop-color: rgb(101, 0, 5);" offset="0.566"></stop>
    //       <stop offset="1" style="stop-color: rgba(165, 93, 30, 0.63);"></stop>
    //     </linearGradient>
    //     <linearGradient id="gradient-14" bx:pinned="true">
    //       <stop offset="0" style="stop-color: rgb(255, 255, 255);"></stop>
    //       <stop offset="1" style="stop-color: rgba(255, 255, 255, 0);"></stop>
    //     </linearGradient>
    //     <linearGradient gradientUnits="userSpaceOnUse" x1="129.576" y1="65.108" x2="129.576" y2="66.244" id="gradient-1" gradientTransform="matrix(1, 0, 0, 1, 2.751241, 0.729039)">
    //       <stop offset="0" style="stop-color: rgba(255, 255, 255, 1)"></stop>
    //       <stop offset="1" style="stop-color: rgba(204, 204, 204, 1)"></stop>
    //     </linearGradient>
    //     <linearGradient gradientUnits="userSpaceOnUse" x1="133.292" y1="65.108" x2="133.292" y2="66.244" id="gradient-5" gradientTransform="matrix(1, 0, 0, 1, 0.626025, 0.248668)">
    //       <stop offset="0" style="stop-color: rgba(255, 255, 255, 1)"></stop>
    //       <stop offset="1" style="stop-color: rgba(204, 204, 204, 1)"></stop>
    //     </linearGradient>
    //     <radialGradient gradientUnits="userSpaceOnUse" cx="446.077" cy="167.436" r="78.035" id="gradient-0" gradientTransform="matrix(2.071489, -0.019353, 0.01532, 1.555377, -772.414917, -58.497934)">
    //       <stop offset="0" style="stop-color: rgba(77, 28, 4, 1)"></stop>
    //       <stop offset="1" style="stop-color: rgba(0, 0, 0, 1)"></stop>
    //     </radialGradient>
    //     <linearGradient gradientUnits="userSpaceOnUse" x1="429.946" y1="105.899" x2="429.946" y2="197.511" id="gradient-6">
    //       <stop offset="0" style="stop-color: rgba(255, 255, 255, 1)"></stop>
    //       <stop offset="1" style="stop-color: rgba(204, 204, 204, 1)"></stop>
    //     </linearGradient>
    //     <radialGradient gradientUnits="userSpaceOnUse" cx="429.946" cy="151.705" r="94.648" id="gradient-7" gradientTransform="matrix(0.243752, 0, 0.064988, 0.243752, 321.234116, 342.072572)">
    //       <stop offset="0" style="stop-color: rgba(255, 255, 255, 1)"></stop>
    //       <stop offset="1" style="stop-color: rgba(204, 204, 204, 1)"></stop>
    //     </radialGradient>
    //   </defs>
    //   <g>
    //     <title>Hero</title>
    //     <g>
    //       <title>Body</title>
    //       <path d="M 107.099 91.109 C 111.631 91.106 115.305 111.254 115.305 136.109 L 115.305 144.061 C 115.305 144.215 115.305 144.368 115.305 144.521 C 124.114 135.757 136.257 130.341 149.665 130.341 C 163.74 130.341 176.42 136.309 185.314 145.853 C 185.31 145.259 185.308 144.661 185.308 144.061 L 185.308 136.109 C 185.308 111.256 188.982 91.109 193.513 91.109 C 198.045 91.106 201.719 111.254 201.719 136.109 L 201.719 144.061 C 201.719 158.952 200.4 172.153 198.368 180.344 C 197.688 206.658 176.143 227.781 149.665 227.781 C 122.758 227.781 100.945 205.968 100.945 179.061 C 100.945 177.655 101.005 176.262 101.121 174.886 C 99.74 166.833 98.894 155.989 98.894 144.061 L 98.894 136.109 C 98.894 111.256 102.568 91.109 107.099 91.109 Z" id="svg_9" fill-opacity="null" stroke-opacity="null" stroke-width="1.5" style="stroke: rgb(0, 0, 0); fill: ${
    //         isBlackPower ? 'rgb(91, 51, 56)' : 'rgb(241, 241, 216)'
    //       };"></path>
    //     </g>
    //     <g id="svg_12" transform="matrix(0.512839, 0, 0, 0.512839, 58.37941, 55.210644)">
    //       <title>Cape</title>
    //       <path id="svg_4" d="m119.5,299.5c1,1 -17,71 -17.5,70.5c0.5,0.5 -19.5,22.5 -19.5,23.5c0,1 37,25 56,16c11,-17 27,6 31,-18c17,2 4,7 19,20c30,10 59,-33 93.5,-30.5c-8.5,-21.5 -49.5,-80.5 -50,-81c0.5,0.5 -26.5,12.5 -27,12c-11.5,6.5 -36.5,9.5 -37,9c-10.5,0.5 -23.5,-8.5 -24,-9c0.5,0.5 -25.5,-13.5 -24.5,-12.5z" stroke-opacity="null" stroke-width="1.5" stroke="#000" fill="#bf0000" style="fill-opacity: 0.93;"></path>
    //       <g id="svg_11">
    //         <path id="svg_5" d="m172.5,384.5c0,-10 2,-20 -2,-34" opacity="0.5" stroke-opacity="null" stroke-width="1.5" stroke="#000" fill="#bf0000" style="fill-opacity: 0.93;"></path>
    //         <path id="svg_6" d="m199.5,394.5c0,-4 -4,-13 -1,-28" opacity="0.5" stroke-opacity="null" stroke-width="1.5" stroke="#000" fill="#bf0000" style="fill-opacity: 0.93;"></path>
    //         <path transform="rotate(-20.28255844116211 239.00000000000003,361) " id="svg_7" d="m235.5,378.5c6,-18 0,-20 7,-35" opacity="0.5" stroke-opacity="null" stroke-width="1.5" stroke="#000" fill="#bf0000" style="fill-opacity: 0.93;"></path>
    //         <path id="svg_8" d="m138.5,395.5c8,-11 11,-50 11,-56" opacity="0.5" stroke-opacity="null" stroke-width="1.5" stroke="#000" fill="#bf0000" style="fill-opacity: 0.93;"></path>
    //       </g>
    //     </g>
    //     <g>
    //       <title>Eyes</title>
    //       <g transform="matrix(1, 0, 0, 1, 1.908873, 77.739716)">
    //         <ellipse style="fill: rgb(255, 255, 255);" cx="131.77" cy="66.856" rx="9.093" ry="4.861"></ellipse>
    //         <g>
    //           <ellipse style="fill: url(#gradient-2);" cx="132.146" cy="65.133" rx="3.138" ry="3.138"></ellipse>
    //           <ellipse style="fill: url(#gradient-3);" cx="132.327" cy="66.405" rx="0.568" ry="0.568"></ellipse>
    //           <ellipse style="fill: url(#gradient-4);" cx="133.918" cy="65.925" rx="0.568" ry="0.568"></ellipse>
    //         </g>
    //       </g>
    //       <g transform="matrix(1, 0, 0, 1, 33.034664, 77.739716)">
    //         <ellipse style="fill: rgb(255, 255, 255);" cx="131.77" cy="66.856" rx="9.093" ry="4.861"></ellipse>
    //         <g>
    //           <ellipse style="fill: url(#gradient-2);" cx="132.146" cy="65.133" rx="3.138" ry="3.138"></ellipse>
    //           <ellipse style="fill: url(#gradient-1);" cx="132.327" cy="66.405" rx="0.568" ry="0.568"></ellipse>
    //           <ellipse style="fill: url(#gradient-5);" cx="133.918" cy="65.925" rx="0.568" ry="0.568"></ellipse>
    //         </g>
    //       </g>
    //     </g>
    //     <g transform="matrix(1.140934, 0, 0, 1.140889, -22.86517, -27.681479)" style="${
    //       isBlackPower ? 'display: none;' : ''
    //     }">
    //       <title>Hair</title>
    //       <path d="M 94.269 170.024 C 94.269 174.302 95.461 188.864 99.977 188.864 C 102.265 188.864 93.38 189.546 93.305 187.26 C 93.269 186.151 94.852 188.877 95.425 189.827 C 96.427 191.486 97.189 193.478 98.342 195.016 C 99.67 196.79 100.788 198.701 102.6 200.06 C 102.933 200.31 105.649 202.186 105.57 202.264 C 104.583 203.234 101.782 202.359 101.688 203.741 C 101.591 205.179 114.192 217.242 113.313 214.434 C 113.043 213.574 109.535 212.891 108.93 213.496 C 108.122 214.304 109.379 224.443 110.224 225.373 C 111.164 226.407 113.974 221.205 114.44 220.735 C 116.733 218.421 119.04 216.57 122.468 216.57 C 123.9 216.57 120.979 219.018 120.251 220.251 C 119.648 221.271 117.77 228.738 119.003 229.992 C 119.486 230.484 123.929 227.007 124.058 226.915 C 126.039 225.488 136.951 217.383 140.178 220.504 C 141.02 221.318 141.791 223.427 142.725 224.361 C 143.466 225.103 148.068 224.249 148.068 226.177 C 148.068 227.303 150.114 223.853 151.014 224.528 C 152.918 225.956 153.736 229.008 155.015 230.958 C 155.519 231.728 155.456 234.162 156.096 233.5 C 157.139 232.422 156.096 225.332 156.096 223.815 C 156.096 222.511 156.096 218.596 156.096 219.901 C 156.096 223.549 160.611 228.942 163.158 231.335 C 164.051 232.174 165.149 225.817 165.307 225.179 C 165.917 222.723 168.52 222.422 170.502 221.795 C 173.297 220.912 172.255 213.547 173.774 221.286 C 175.201 228.561 172.136 211.955 174.279 223.864 C 174.527 225.239 174.916 226.645 175.054 228.034 C 175.331 230.814 175.054 233.741 175.054 236.546 C 175.054 237.389 175.998 235.143 176.539 234.496 C 177.612 233.214 178.759 231.985 179.846 230.705 C 182.71 227.33 187.209 221.768 187.209 217.055 C 187.209 215.781 187.209 219.602 187.209 220.875 C 187.209 221.755 187.828 228.979 186.456 229.083 C 186.234 229.1 188.223 225.767 188.333 225.572 C 189.54 223.437 190.549 221.084 191.653 218.865 C 193.629 214.898 193.153 210.788 197.219 207.714 C 198.772 206.54 203.715 205.989 204.488 204.367 C 204.928 203.446 200.969 203.858 201.685 203.13 C 202.56 202.24 208.716 195.57 208.758 194.249 C 208.843 191.556 200.706 192.268 200.706 194.962 C 200.706 197.062 203.485 191.755 204.418 189.875 C 205.898 186.896 208.57 177.341 212.508 177.341 C 213.884 177.341 209.743 177.352 208.386 177.123 C 205.731 176.676 202.263 178.661 200.313 176.803 C 198.838 175.398 203.615 164.145 204.851 164.145 C 205.618 164.145 203.174 163.488 202.559 163.946 C 201.977 164.38 197.412 168.61 196.886 168.138 C 194.123 165.664 196.088 161.816 195.099 158.959 C 194.364 156.833 190.533 153.566 189.216 150.439 C 188.899 149.688 192.778 157.534 192.778 161.703 C 192.778 163.337 191.92 158.475 190.97 157.145 C 188.691 153.956 189.84 155.611 186.591 153.281 C 184.806 152.001 180.139 152.427 181.071 152.839 C 182.416 153.433 186.593 156.916 185.027 158.534 C 184.764 158.806 179.005 154.824 178.541 154.514 C 172.573 150.536 180.578 154.925 173.855 152.4 C 173.33 152.202 167.898 150.964 169.122 151.881 C 169.13 151.887 173.391 155.27 172.905 155.515 C 170.867 156.542 166.742 154.84 164.845 154.436 C 158.601 153.11 141.223 144.378 135.713 155.232 C 134.82 156.993 141.202 153.713 143.15 153.39 C 147.583 152.657 144.823 152.695 149.155 154.111 C 149.457 154.209 154.359 156.726 153.992 157.129 C 153.112 158.098 145.515 154.794 144.364 154.794 C 135.91 154.794 126.49 155.57 118.131 155.57 C 116.773 155.57 128.537 161.262 127.521 159.05 C 127.244 158.446 119.874 159.387 118.622 159.01 C 111.022 156.72 108.018 160.719 100.346 159.429 C 99.49 159.286 92.182 157.135 94.82 154.582 C 95.65 153.779 94.901 156.96 95.417 157.993 C 96.211 159.579 98.229 161.531 99.485 162.787 C 101.29 164.592 103.645 166.031 105.63 167.519 C 106.534 168.198 110.069 168.267 108.939 168.267 C 100.331 168.267 92.892 166.307 84.933 163.317 C 84.365 163.103 77.883 159.738 78.2 159.378 C 78.576 158.951 83.475 163.064 83.771 163.36 C 87.328 166.917 93.341 173.731 98.455 173.731" style="fill: rgb(77, 28, 4);"></path>
    //     </g>
    //     <g transform="matrix(1, 0, 0, 1, -2.498024, 1.554847)" style="${
    //       isBlackPower ? '' : 'display: none;'
    //     }">
    //       <title>BlackPowerHair</title>
    //       <g>
    //         <g>
    //           <title>HairBlack</title>
    //           <path d="M 88.06 182.018 C 86.195 176.576 83.066 180.219 81.601 181.603 C 80.404 182.734 82.803 184.249 83.496 184.249 C 83.999 184.249 82.49 184.531 82.132 184.874 C 81.442 185.537 81.146 189.065 81.474 190.094 C 82.197 192.354 85.33 191.242 85.314 191.226 C 83.358 189.257 79.994 198.473 82.876 199.886 C 84.123 200.498 88.295 198.898 86.918 197.513 C 86.844 197.438 85.635 199.592 85.635 199.923 C 85.635 200.97 87.87 209.271 90.472 206.532 C 91.193 205.774 89.666 204.78 89.091 205.367 C 87.81 206.675 88.762 212.862 89.229 214.339 C 89.886 216.418 92.537 217.183 94.464 217.183 C 94.729 217.183 97.672 216.741 97.059 216.115 C 95.603 214.627 93.729 219.401 94.838 220.842 C 95.918 222.243 100.233 225.482 102.364 224.429 C 103.261 223.986 103.06 220.595 103.06 221.573 C 103.06 225.325 107.116 229.013 111.583 226.806 C 112.232 226.485 112.716 224.231 112.232 223.712 C 111.875 223.332 111.545 226.764 111.717 227.247 C 112.404 229.193 116.567 231.455 118.705 230.398 C 119.244 230.132 119.956 228.255 119.306 227.929 C 118.695 227.622 118.736 231.74 118.736 232.227 C 118.736 234.786 120.399 236.212 122.361 237.643 C 123.59 238.539 129.877 238.234 128.064 236.38 C 127.935 236.249 127.459 239.913 127.459 240.249 C 127.459 242.66 128.536 245.684 131.15 246.691 C 133.978 247.782 135.325 246.318 135.689 243.468 C 135.724 243.194 135.696 239.903 135.374 240.197 C 134.337 241.144 137.155 243.117 137.645 243.355 C 139.491 244.253 145.591 245.776 147.403 243.994 C 151.211 240.252 142.308 239.509 147.848 243.378 C 148.353 243.73 148.823 243.845 149.388 244.05 C 150.129 244.321 150.869 244.647 151.673 244.745 C 153.764 244.998 155.851 244.915 157.231 243.209 C 158.013 242.244 157.875 238.341 157.844 239.57 C 157.818 240.56 162.431 242.194 163.246 242.408 C 167.547 243.532 177.984 245.037 180.575 239.969 C 181.543 238.075 178.376 233.44 176.513 235.037 C 176.062 235.424 180.389 237.326 180.814 237.441 C 180.878 237.458 191.784 238.901 189.631 236.7 C 189.627 236.694 190.449 239.424 191.634 238.252 C 192.39 237.505 191.753 233.577 191.753 232.588 C 191.753 231.818 191.753 229.511 191.753 230.28 C 191.753 233.377 196.926 235.485 199.793 234.51 C 200.32 234.331 199.568 232.513 199.969 232.89 C 200.153 233.064 205.525 233.487 206.017 233.008 C 206.334 232.698 207.27 228.629 206.31 229.084 C 205.907 229.277 210.269 230.953 211.932 229.319 C 212.721 228.544 214.409 225.788 213.814 224.63 C 213.51 224.038 211.242 223.884 211.921 223.884 C 212.697 223.884 214.541 224.609 215.278 224.128 C 217.052 222.968 215.958 217.115 215.649 217.397 C 214.829 218.145 219.862 219.706 220.876 218.912 C 222.249 217.835 222.343 215.927 222.343 214.317 C 222.343 213.625 221.311 212.264 222.021 212.264 C 223.455 212.264 225.606 213.842 225.926 211.516 C 226.098 210.268 224.944 201.269 221.459 204.554 C 221.007 204.979 225.409 206.677 226.484 205.62 C 229.409 202.745 225.68 200.813 224.38 199.607 C 223.49 198.782 225.989 197.752 226.474 196.653 C 227.474 194.387 227.963 188.998 225.437 187.506 C 220.054 184.331 223.479 194.486 226.157 191.707 C 228.817 188.948 223.743 187.502 222.939 186.669 C 222.374 186.084 225.187 180.865 224.619 179.209 C 224.167 177.892 220.009 176.249 218.851 177.26 C 218.581 177.495 222.588 178.404 223.303 178.053 C 224.458 177.488 225.114 175.335 224.619 174.175 C 223.944 172.59 219.756 171.199 219.002 173.302 C 218.537 174.598 220.818 175.179 220.362 171.643 C 219.967 168.582 216.937 168.794 215.475 167.436 C 214.47 166.505 216.431 161.289 215.892 159.712 C 215.234 157.787 211.509 158.658 211.577 158.728 C 211.761 158.913 211.806 155.409 210.435 154.271 C 209.396 153.409 207.502 151.665 205.913 152.142 C 205.605 152.234 205.417 153.838 205.231 153.857 C 204.019 153.975 202.888 151.971 203.281 150.849 C 205.163 145.477 191.649 141.877 191.649 146.075 C 191.649 146.735 191.21 144.81 190.83 144.265 C 190.174 143.321 189.112 142.27 188.216 141.555 C 185.853 139.671 181.38 139.238 178.412 139.718 C 177.166 139.919 176.859 142.278 176.859 143.229 C 176.859 143.805 177.067 145.521 177.076 144.944 C 177.098 143.634 173.243 141.74 171.949 142.366 C 169.68 143.464 171.272 146.847 171.273 146.845 C 171.599 146.24 168.547 144.73 168.043 144.513 C 164.879 143.146 161.49 145.077 161.49 148.66 C 161.49 149.442 160.762 147.236 160.195 146.684 C 159.214 145.727 157.505 144.57 156.079 144.364 C 153.959 144.057 152.972 144.597 152.023 146.43 C 151.679 147.095 152.495 149.333 152.176 148.657 C 151.258 146.71 140.171 144.342 139.164 146.274 C 137.77 148.948 142.543 148.014 141.226 146.8 C 139.885 145.565 130.422 143.937 132.954 147.227 C 136.763 152.172 142.482 142.101 136.577 141.142 C 132.944 140.552 133.054 142.995 131.179 144.881 C 131.154 144.905 126.527 142.384 125.405 143.461 C 124.823 144.02 125.283 146.46 125.786 146.961 C 128.605 149.769 130.446 145.287 127.335 144.011 C 125.711 143.344 122.326 143.308 121.127 144.692 C 120.617 145.28 119.617 149.647 120.85 148.557 C 122.358 147.222 115.993 145.611 114.948 145.949 C 114.346 146.143 111.025 148.446 111.992 149.481 C 112.681 150.219 116.477 147.381 111.402 146.558 C 108.725 146.125 106.366 148.499 106.366 151.124 C 106.366 152.043 105.149 149.479 104.218 149.327 C 101.736 148.922 99.659 149.669 98.173 151.583 C 97.744 152.134 97.333 156.187 98.543 154.973 C 100.951 152.554 91.252 151.253 90.01 151.451 C 87.333 151.879 85.671 161.91 88.364 162.449 C 91.323 163.039 85.55 158.073 84.801 162.402 C 84.607 163.52 85.744 169.777 88.087 167.668 C 88.782 167.042 85.521 166.739 85.283 166.739 C 83.919 166.739 82.96 168.278 82.695 169.508 C 82.444 170.673 84.211 174.447 85.635 173.039 C 87.127 171.562 83.377 170.622 82.453 171.217 C 77.355 174.497 85.498 177.794 88.311 177.794 C 89.518 177.794 85.997 178.665 85.137 179.489 C 84.567 180.037 84.269 182.232 85.928 182.232" style="fill: url(#gradient-0);"></path>
    //         </g>
    //       </g>
    //       <g transform="matrix(0, 1, -1, 0, 578.75415, -275.344452)">
    //         <title>Comb</title>
    //         <path d="M 445.047 389.314 L 445.047 389.313 C 440.699 389.22 436.583 386.781 433.892 383.442 L 428.815 380.9 C 428.8 380.9 428.788 380.899 428.788 380.899 C 428.618 380.899 428.426 380.935 428.284 380.969 C 428.141 381.003 427.076 380.995 426.647 380.995 C 426.226 380.944 424.759 381.072 424.695 381.089 C 424.631 381.108 424.533 381.211 424.444 381.332 C 424.354 381.454 424.027 381.656 424.027 381.656 C 423.766 381.899 423.855 381.954 423.631 382.073 C 423.407 382.191 422.358 382.397 422.281 382.445 C 422.154 382.525 420.881 382.743 420.703 382.721 C 420.527 382.7 420.575 382.654 420.596 382.566 L 421.53 381.044 C 421.574 381.003 421.554 380.932 421.452 380.895 C 421.35 380.856 421.259 380.758 421.259 380.758 C 421.182 380.637 420.813 380.37 420.401 380.014 C 419.939 379.707 419.868 379.331 419.735 379.13 C 419.601 378.928 418.946 377.558 418.89 377.384 C 418.833 377.208 419.111 377.384 419.111 377.384 C 419.614 377.7 421.121 378.727 421.141 378.741 C 421.138 378.738 421.085 378.7 421.577 378.891 C 422.086 379.087 422.625 379.224 422.877 379.351 C 423.351 379.456 423.549 379.68 423.647 379.802 C 423.743 379.923 423.786 379.877 423.786 379.877 C 423.808 379.797 423.936 379.624 423.911 379.528 C 423.885 379.432 423.997 379.322 423.997 379.322 C 424.036 379.259 424.858 379.276 425.627 379.306 L 425.307 379.145 C 424.842 379.103 424.105 378.99 423.974 378.954 C 423.793 378.903 423.628 378.95 423.541 378.882 C 423.46 378.818 423.365 378.282 423.296 378.139 L 423.221 378.103 C 423.222 378.106 423.222 378.108 423.222 378.108 C 423.278 378.435 422.927 379.175 422.762 379.178 C 422.598 379.181 418.538 376.854 418.352 376.636 C 418.167 376.42 417.989 376.043 417.908 375.936 C 417.826 375.831 417.63 375.651 417.522 375.38 C 417.413 375.107 417.348 375.07 417.303 375.051 C 417.259 375.031 417.287 375.268 417.287 375.268 C 417.152 375.584 416.663 375.781 416.426 375.697 C 416.191 375.613 416.162 375.681 416.162 375.681 C 416.352 375.941 417.334 376.664 417.334 376.664 C 417.576 377.162 417.465 378.055 417.406 378.347 C 417.347 378.641 416.539 378.71 416.353 378.66 C 416.17 378.61 414.024 375.518 413.801 374.989 C 413.54 374.367 416.483 372.399 416.919 372.399 C 417.355 372.399 419.17 373.783 420.52 374.454 C 421.847 375.114 422.894 375.936 423.05 375.859 C 424.172 375.655 424.655 375.544 426.045 375.344 C 426.728 375.244 427.089 375.244 427.28 375.27 L 431.132 372.642 C 431.153 372.575 431.173 372.508 431.196 372.441 C 432.284 369.127 435.273 367.069 439.094 366.986 L 439.093 366.983 L 455.632 366.983 L 455.827 367.715 L 439.532 367.715 L 439.648 368.15 L 455.943 368.15 L 456.138 368.881 L 439.843 368.881 L 439.985 369.414 L 456.28 369.414 L 456.475 370.145 L 440.18 370.145 L 440.285 370.539 L 456.58 370.539 L 456.775 371.27 L 440.48 371.27 L 440.596 371.705 L 456.891 371.705 L 457.086 372.437 L 440.791 372.437 L 440.933 372.969 L 457.228 372.969 L 457.423 373.699 L 441.128 373.699 L 441.244 374.136 L 457.539 374.136 L 457.734 374.866 L 441.439 374.866 L 441.569 375.354 L 457.864 375.354 L 458.059 376.086 L 441.764 376.086 L 441.88 376.521 L 458.175 376.521 L 458.37 377.252 L 442.075 377.252 L 442.217 377.785 L 458.512 377.785 L 458.707 378.516 L 442.407 378.516 L 442.517 378.951 L 458.823 378.951 L 459.018 379.683 L 442.703 379.683 L 442.826 380.17 L 459.148 380.17 L 459.343 380.901 L 443.012 380.901 L 443.122 381.336 L 459.459 381.336 L 459.654 382.068 L 443.308 382.068 L 443.442 382.601 L 459.796 382.601 L 459.991 383.332 L 443.628 383.332 L 443.738 383.767 L 460.107 383.767 L 460.302 384.498 L 443.924 384.498 L 444.047 384.986 L 460.432 384.986 L 460.627 385.717 L 444.233 385.717 L 444.343 386.152 L 460.743 386.152 L 460.938 386.883 L 444.529 386.883 L 444.663 387.416 L 461.08 387.416 L 461.275 388.148 L 444.849 388.148 L 444.959 388.583 L 461.391 388.583 L 461.586 389.314 Z M 419.262 383.532 L 418.345 382.822 C 418.2 382.709 417.977 382.456 418.068 382.327 L 420.017 380.233 C 420.107 380.104 420.3 380.089 420.447 380.202 L 421.191 380.773 C 421.338 380.885 421.383 381.083 421.293 381.213 L 419.692 383.501 C 419.603 383.631 419.408 383.645 419.262 383.532 Z M 417.207 381.958 L 416.138 381.107 C 415.905 380.887 415.856 380.562 416.031 380.387 L 418.295 378.443 C 418.468 378.268 418.803 378.306 419.036 378.527 L 419.718 379.444 C 419.951 379.664 419.998 379.987 419.825 380.162 L 417.947 382.042 C 417.773 382.217 417.44 382.179 417.207 381.958 Z M 414.907 377.506 L 413.862 378.314 C 413.774 378.382 413.654 378.487 413.535 378.472 C 413.385 378.452 413.233 378.291 413.113 378.159 L 412.318 377.282 C 412.102 377.045 412.087 376.727 412.283 376.576 L 413.329 375.766 C 413.433 375.686 413.595 375.413 413.74 375.451 C 413.865 375.483 414.075 375.756 414.174 375.866 L 414.899 376.906 C 415.113 377.142 415.103 377.354 414.907 377.506 Z M 413.832 378.577 L 414.893 377.821 C 414.999 377.745 415.162 377.562 415.305 377.602 C 415.433 377.639 415.542 377.884 415.642 377.997 C 415.782 378.177 416.139 378.844 416.381 378.853 C 416.654 378.863 417.084 378.598 417.425 378.788 C 417.506 378.882 417.199 379.174 416.97 379.365 C 416.872 379.445 416.824 379.538 416.794 379.569 C 416.723 379.64 416.682 379.722 416.59 379.785 L 415.531 380.54 C 415.328 380.684 414.991 380.605 414.782 380.363 L 413.843 379.279 C 413.633 379.037 413.63 378.722 413.832 378.577 Z M 417.671 377.342 C 417.67 377.139 417.69 376.71 417.451 376.586 C 417.217 376.464 417.159 376.463 417.126 376.309 C 417.108 376.056 417.345 376.119 417.428 376.178 C 417.599 376.298 418.36 377.109 418.623 377.537 C 418.656 377.589 418.634 377.633 418.536 377.714 C 418.438 377.794 417.837 378.5 417.759 378.562 C 417.677 378.612 417.659 378.558 417.659 378.558 Z" style="stroke: url(#gradient-7); stroke-width: 0.1px; fill: rgb(223, 161, 25);" transform="matrix(0.87924, 0.476379, -0.476379, 0.87924, 232.897952, -162.448475)"></path>
    //         <path d="M 456.2988403135279 405.68258617283817 C 454.84565212467635 405.6825866699219 452.58893379555883 405.86298901649 451.8606872558594 404.42816162109375 C 451.46323168524674 403.64507497381186 451.2886901535896 399.9430236816406 452.6865234375 399.9430236816406 C 453.38357454954394 399.9430236816406 450.97266812771767 399.8294167781997 450.74298095703125 399.1712951660156 C 450.31615503371864 397.9483127768253 449.1167391516889 395.1539591307472 451.01776123046875 394.2106018066406 C 451.3360589088833 394.0526507499274 452.28483011240013 394.19160597031987 452.0458068847656 393.9286804199219 C 450.25594811441874 391.9598357725403 446.9157924889174 391.32205618172094 449.693603515625 386.57733154296875 C 450.0675881828256 385.9385356537158 450.68922107849625 384.7362976074219 451.5531311035156 384.7362976074219 C 452.7613743057837 384.7362976074219 449.2022262950419 382.6804943119541 449.7391662597656 381.5981140136719 C 450.5354949530478 379.99284984040645 452.29860169203505 380.9648216699899 453.0752258300781 380.22552490234375 C 453.8716522011168 379.46737766877897 452.0938589949356 376.9753752755289 452.63525390625 375.89276123046875 C 453.0239894045609 375.11541644667113 455.62132970211945 374.5742492675781 456.3742980957031 374.5742492675781 C 456.4350878220515 374.5742492675781 458.32099972473503 374.48264850089583 458.14556884765625 374.6639709472656 C 458.0256330222959 374.78793462814 456.27670394864873 370.63560558583396 457.529052734375 370.2457580566406 C 459.3236991023135 369.6870970348144 461.3027415000197 372.2239937198469 461.7621765136719 371.98712158203125 C 462.9264459116939 371.3868560970162 462.27206153815814 367.70644381454804 465.525390625 369.3444519042969 C 467.40697533550593 370.2918048756953 468.96453674552595 373.35881623542735 468.24639892578125 375.4541931152344 C 467.9331226188674 376.3682682585432 464.8542951979546 377.0971852373049 465.49835205078125 376.3768615722656 C 466.3781240635483 375.3929102365193 466.66604289884765 382.7536777324151 466.35693359375 383.74102783203125 C 465.5853738605909 386.2055268517349 463.63418024781527 388.89934972591726 462.5737609863281 390.95709228515625 C 462.2744470313112 391.5379107276172 464.0186516459867 394.82466236097525 463.4949951171875 396.497314453125 C 463.03516633160393 397.9660893808447 456.86986460462305 404.3868713378906 456.4825134277344 404.3868713378906" style="fill: rgb(61, 23, 5);"></path>
    //       </g>
    //     </g>
    //   </g>
    // </svg>
    // `,
  })
}
