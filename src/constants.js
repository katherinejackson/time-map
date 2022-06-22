export const canvasSize = 200

export const radianPerDay = 0.01721420632

export const legendRadianPerYear = 0.1532484221

export const radianPerYear = 0.01532484221

export const radianPerMonth = 0.52359877559

export const pinSize = 5

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

export const abbreviatedMonths = ["JA", "FE", "MR", "AL", "MA", "JN", "JL", "AU", "SE", "OC", "NO", "DE"]

export const monthColours = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"]

export const migrationYears = ['1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989',
     '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', 
     '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', 
     '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020']

export const themeColours = {
    DEFAULT: {
        background: 255,
        lineColour: 50,
        textColour: 0,
        pinColour: 50,
        pinBackground: 220,
        missingData: 150,
        name: 'DEFAULT'
    },
    DARK: {
        background: 0,
        lineColour: 200,
        textColour: 255,
        pinColour: 200,
        pinBackground: 80,
        missingData: 150,
        name: 'DARK',
    },
    COLOUR_DARK: {
        background: 0,
        lineColour: 200,
        textColour: 255,
        pinColour: 200,
        pinBackground: 80,
        missingData: 150,
        name: 'COLOUR_DARK'
    },
}

export const themes = {
    DEFAULT: { id: 1, name: 'Default', val: 'DEFAULT' },
    DARK: { id: 2, name: 'Dark Mode', val: 'DARK' },
    COLOUR_DARK: { id: 3, name: 'Coloured Dark Mode', val: 'COLOUR_DARK' },
}

export const colours = {
    TEMP: {
        0: ['black'],
        3: ['#FF0000', '#00FF00', '#0000FF'],
        4: ['#FF0000', '#FFFF00', '#00FF00', '#0000FF'],
        5: ['#FF0000', '#FFFF00', '#00FF00', '#0000FF', '#00FFFF'],
        6: ['#FF0000','#FFFF00',"#437731","#00bfbf","#255ffb","#7f11ee"],
        7: ['#FF00FF', '#FF0000', '#FF8000', '#FFFF00', '#00FF00', '#0000FF', '#00FFFF'],
        8: ['#FF00FF', '#FF0000','#FFFF00',"#7fee11","#437731","#00bfbf","#255ffb","#7f11ee"],
    },
    WIND: {
        2: ['#FFFFFF', '#0000FF'],
        3: ['#FFFFFF', '#008B8B', '#0000FF'],
        4: ['#FFFFFF', '#008B8B', '#0000FF', '#FF00FF'],
    },
    PRECIP: {
        2: ['#FFFFFF', '#0000FF'],
        3: ['#FFFFFF', '#00BFFF', '#0000FF'],
        4: ['#FFFFFF', '#00BFFF', '#0000FF', '#9932CC'],
    },
    COVID: {
        0: ['black'],
        6: ['#FF0000','#FFFF00',"#437731","#00bfbf","#255ffb","#7f11ee"],
        8: ['#FF00FF', '#FF0000','#FFFF00',"#7fee11","#437731","#00bfbf","#255ffb","#7f11ee"],
        256: ["#ffffcc", "#fffecb", "#fffec9", "#fffdc8", "#fffdc6", "#fffcc5", "#fffcc4", "#fffbc2", "#fffac1", "#fffac0", "#fff9be", "#fff9bd", "#fff8bb", "#fff8ba", "#fff7b9", "#fff6b7", "#fff6b6", "#fff5b5", "#fff5b3", "#fff4b2", "#fff4b0", "#fff3af", "#fff2ae", "#fff2ac", "#fff1ab", "#fff1aa", "#fff0a8", "#fff0a7", "#ffefa6", "#ffeea4", "#ffeea3", "#ffeda2", "#ffeda0", "#ffec9f", "#ffeb9d", "#ffeb9c", "#ffea9b", "#ffea99", "#ffe998", "#ffe897", "#ffe895", "#ffe794", "#ffe693", "#ffe691", "#ffe590", "#ffe48f", "#ffe48d", "#ffe38c", "#fee28b", "#fee289", "#fee188", "#fee087", "#fee085", "#fedf84", "#fede83", "#fedd82", "#fedc80", "#fedc7f", "#fedb7e", "#feda7c", "#fed97b", "#fed87a", "#fed778", "#fed777", "#fed676", "#fed574", "#fed473", "#fed372", "#fed270", "#fed16f", "#fed06e", "#fecf6c", "#fece6b", "#fecd6a", "#fecb69", "#feca67", "#fec966", "#fec865", "#fec764", "#fec662", "#fec561", "#fec460", "#fec25f", "#fec15e", "#fec05c", "#febf5b", "#febe5a", "#febd59", "#febb58", "#feba57", "#feb956", "#feb855", "#feb754", "#feb553", "#feb452", "#feb351", "#feb250", "#feb14f", "#feb04e", "#feae4d", "#fead4d", "#feac4c", "#feab4b", "#feaa4a", "#fea84a", "#fea749", "#fea648", "#fea547", "#fea347", "#fea246", "#fea145", "#fda045", "#fd9e44", "#fd9d44", "#fd9c43", "#fd9b42", "#fd9942", "#fd9841", "#fd9741", "#fd9540", "#fd9440", "#fd923f", "#fd913f", "#fd8f3e", "#fd8e3e", "#fd8d3d", "#fd8b3c", "#fd893c", "#fd883b", "#fd863b", "#fd853a", "#fd833a", "#fd8139", "#fd8039", "#fd7e38", "#fd7c38", "#fd7b37", "#fd7937", "#fd7736", "#fc7535", "#fc7335", "#fc7234", "#fc7034", "#fc6e33", "#fc6c33", "#fc6a32", "#fc6832", "#fb6731", "#fb6531", "#fb6330", "#fb6130", "#fb5f2f", "#fa5d2e", "#fa5c2e", "#fa5a2d", "#fa582d", "#f9562c", "#f9542c", "#f9522b", "#f8512b", "#f84f2a", "#f74d2a", "#f74b29", "#f64929", "#f64828", "#f54628", "#f54427", "#f44227", "#f44127", "#f33f26", "#f23d26", "#f23c25", "#f13a25", "#f03824", "#f03724", "#ef3524", "#ee3423", "#ed3223", "#ed3123", "#ec2f22", "#eb2e22", "#ea2c22", "#e92b22", "#e92921", "#e82821", "#e72621", "#e62521", "#e52420", "#e42220", "#e32120", "#e22020", "#e11f20", "#e01d20", "#df1c20", "#de1b20", "#dd1a20", "#dc1920", "#db1820", "#da1720", "#d91620", "#d81520", "#d71420", "#d51320", "#d41221", "#d31121", "#d21021", "#d10f21", "#cf0e21", "#ce0d21", "#cd0d22", "#cc0c22", "#ca0b22", "#c90a22", "#c80a22", "#c60923", "#c50823", "#c40823", "#c20723", "#c10723", "#bf0624", "#be0624", "#bc0524", "#bb0524", "#b90424", "#b80424", "#b60425", "#b50325", "#b30325", "#b10325", "#b00225", "#ae0225", "#ac0225", "#ab0225", "#a90125", "#a70126", "#a50126", "#a40126", "#a20126", "#a00126", "#9e0126", "#9c0026", "#9a0026", "#990026", "#970026", "#950026", "#930026", "#910026", "#8f0026", "#8d0026", "#8b0026", "#8a0026", "#880026", "#860026", "#840026", "#820026", "#800026"],
    },
    TRADE: {
        0: ['black'],
        7: ["#4e79a7","#f28e2c","#76b7b2","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"],
        256: ["#ffffcc", "#fffecb", "#fffec9", "#fffdc8", "#fffdc6", "#fffcc5", "#fffcc4", "#fffbc2", "#fffac1", "#fffac0", "#fff9be", "#fff9bd", "#fff8bb", "#fff8ba", "#fff7b9", "#fff6b7", "#fff6b6", "#fff5b5", "#fff5b3", "#fff4b2", "#fff4b0", "#fff3af", "#fff2ae", "#fff2ac", "#fff1ab", "#fff1aa", "#fff0a8", "#fff0a7", "#ffefa6", "#ffeea4", "#ffeea3", "#ffeda2", "#ffeda0", "#ffec9f", "#ffeb9d", "#ffeb9c", "#ffea9b", "#ffea99", "#ffe998", "#ffe897", "#ffe895", "#ffe794", "#ffe693", "#ffe691", "#ffe590", "#ffe48f", "#ffe48d", "#ffe38c", "#fee28b", "#fee289", "#fee188", "#fee087", "#fee085", "#fedf84", "#fede83", "#fedd82", "#fedc80", "#fedc7f", "#fedb7e", "#feda7c", "#fed97b", "#fed87a", "#fed778", "#fed777", "#fed676", "#fed574", "#fed473", "#fed372", "#fed270", "#fed16f", "#fed06e", "#fecf6c", "#fece6b", "#fecd6a", "#fecb69", "#feca67", "#fec966", "#fec865", "#fec764", "#fec662", "#fec561", "#fec460", "#fec25f", "#fec15e", "#fec05c", "#febf5b", "#febe5a", "#febd59", "#febb58", "#feba57", "#feb956", "#feb855", "#feb754", "#feb553", "#feb452", "#feb351", "#feb250", "#feb14f", "#feb04e", "#feae4d", "#fead4d", "#feac4c", "#feab4b", "#feaa4a", "#fea84a", "#fea749", "#fea648", "#fea547", "#fea347", "#fea246", "#fea145", "#fda045", "#fd9e44", "#fd9d44", "#fd9c43", "#fd9b42", "#fd9942", "#fd9841", "#fd9741", "#fd9540", "#fd9440", "#fd923f", "#fd913f", "#fd8f3e", "#fd8e3e", "#fd8d3d", "#fd8b3c", "#fd893c", "#fd883b", "#fd863b", "#fd853a", "#fd833a", "#fd8139", "#fd8039", "#fd7e38", "#fd7c38", "#fd7b37", "#fd7937", "#fd7736", "#fc7535", "#fc7335", "#fc7234", "#fc7034", "#fc6e33", "#fc6c33", "#fc6a32", "#fc6832", "#fb6731", "#fb6531", "#fb6330", "#fb6130", "#fb5f2f", "#fa5d2e", "#fa5c2e", "#fa5a2d", "#fa582d", "#f9562c", "#f9542c", "#f9522b", "#f8512b", "#f84f2a", "#f74d2a", "#f74b29", "#f64929", "#f64828", "#f54628", "#f54427", "#f44227", "#f44127", "#f33f26", "#f23d26", "#f23c25", "#f13a25", "#f03824", "#f03724", "#ef3524", "#ee3423", "#ed3223", "#ed3123", "#ec2f22", "#eb2e22", "#ea2c22", "#e92b22", "#e92921", "#e82821", "#e72621", "#e62521", "#e52420", "#e42220", "#e32120", "#e22020", "#e11f20", "#e01d20", "#df1c20", "#de1b20", "#dd1a20", "#dc1920", "#db1820", "#da1720", "#d91620", "#d81520", "#d71420", "#d51320", "#d41221", "#d31121", "#d21021", "#d10f21", "#cf0e21", "#ce0d21", "#cd0d22", "#cc0c22", "#ca0b22", "#c90a22", "#c80a22", "#c60923", "#c50823", "#c40823", "#c20723", "#c10723", "#bf0624", "#be0624", "#bc0524", "#bb0524", "#b90424", "#b80424", "#b60425", "#b50325", "#b30325", "#b10325", "#b00225", "#ae0225", "#ac0225", "#ab0225", "#a90125", "#a70126", "#a50126", "#a40126", "#a20126", "#a00126", "#9e0126", "#9c0026", "#9a0026", "#990026", "#970026", "#950026", "#930026", "#910026", "#8f0026", "#8d0026", "#8b0026", "#8a0026", "#880026", "#860026", "#840026", "#820026", "#800026"],
    },
    BRIDGE: {
        0: ['black'],
        6: ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#2c7fb8","#253494"],
    }
}

export const viridis = ["#fde725","#fbe723","#f8e621","#f6e620","#f4e61e","#f1e51d","#efe51c","#ece51b","#eae51a","#e7e419","#e5e419","#e2e418","#dfe318","#dde318","#dae319","#d8e219","#d5e21a","#d2e21b","#d0e11c","#cde11d","#cae11f","#c8e020","#c5e021","#c2df23","#c0df25","#bddf26","#bade28","#b8de29","#b5de2b","#b2dd2d","#b0dd2f","#addc30","#aadc32","#a8db34","#a5db36","#a2da37","#a0da39","#9dd93b","#9bd93c","#98d83e","#95d840","#93d741","#90d743","#8ed645","#8bd646","#89d548","#86d549","#84d44b","#81d34d","#7fd34e","#7cd250","#7ad151","#77d153","#75d054","#73d056","#70cf57","#6ece58","#6ccd5a","#69cd5b","#67cc5c","#65cb5e","#63cb5f","#60ca60","#5ec962","#5cc863","#5ac864","#58c765","#56c667","#54c568","#52c569","#50c46a","#4ec36b","#4cc26c","#4ac16d","#48c16e","#46c06f","#44bf70","#42be71","#40bd72","#3fbc73","#3dbc74","#3bbb75","#3aba76","#38b977","#37b878","#35b779","#34b679","#32b67a","#31b57b","#2fb47c","#2eb37c","#2db27d","#2cb17e","#2ab07f","#29af7f","#28ae80","#27ad81","#26ad81","#25ac82","#25ab82","#24aa83","#23a983","#22a884","#22a785","#21a685","#21a585","#20a486","#20a386","#1fa287","#1fa187","#1fa188","#1fa088","#1f9f88","#1f9e89","#1e9d89","#1e9c89","#1e9b8a","#1f9a8a","#1f998a","#1f988b","#1f978b","#1f968b","#1f958b","#1f948c","#20938c","#20928c","#20928c","#21918c","#21908d","#218f8d","#218e8d","#228d8d","#228c8d","#228b8d","#238a8d","#23898e","#23888e","#24878e","#24868e","#25858e","#25848e","#25838e","#26828e","#26828e","#26818e","#27808e","#277f8e","#277e8e","#287d8e","#287c8e","#297b8e","#297a8e","#29798e","#2a788e","#2a778e","#2a768e","#2b758e","#2b748e","#2c738e","#2c728e","#2c718e","#2d718e","#2d708e","#2e6f8e","#2e6e8e","#2e6d8e","#2f6c8e","#2f6b8e","#306a8e","#30698e","#31688e","#31678e","#31668e","#32658e","#32648e","#33638d","#33628d","#34618d","#34608d","#355f8d","#355e8d","#365d8d","#365c8d","#375b8d","#375a8c","#38598c","#38588c","#39568c","#39558c","#3a548c","#3a538b","#3b528b","#3b518b","#3c508b","#3c4f8a","#3d4e8a","#3d4d8a","#3e4c8a","#3e4a89","#3e4989","#3f4889","#3f4788","#404688","#404588","#414487","#414287","#424186","#424086","#423f85","#433e85","#433d84","#443b84","#443a83","#443983","#453882","#453781","#453581","#463480","#46337f","#46327e","#46307e","#472f7d","#472e7c","#472d7b","#472c7a","#472a7a","#482979","#482878","#482677","#482576","#482475","#482374","#482173","#482071","#481f70","#481d6f","#481c6e","#481b6d","#481a6c","#48186a","#481769","#481668","#481467","#471365","#471164","#471063","#470e61","#470d60","#460b5e","#460a5d","#46085c","#46075a","#450559","#450457","#440256","#440154"]

export const magma = ["#fcfdbf","#fcfbbd","#fcf9bb","#fcf7b9","#fcf6b8","#fcf4b6","#fcf2b4","#fcf0b2","#fceeb0","#fcecae","#fdebac","#fde9aa","#fde7a9","#fde5a7","#fde3a5","#fde2a3","#fde0a1","#fddea0","#fddc9e","#fdda9c","#fed89a","#fed799","#fed597","#fed395","#fed194","#fecf92","#fecd90","#fecc8f","#feca8d","#fec88c","#fec68a","#fec488","#fec287","#fec185","#febf84","#febd82","#febb81","#feb97f","#feb77e","#feb67c","#feb47b","#feb27a","#feb078","#feae77","#feac76","#feaa74","#fea973","#fea772","#fea571","#fea36f","#fea16e","#fe9f6d","#fe9d6c","#fd9b6b","#fd9a6a","#fd9869","#fd9668","#fd9467","#fd9266","#fc9065","#fc8e64","#fc8c63","#fc8a62","#fc8961","#fb8761","#fb8560","#fb835f","#fa815f","#fa7f5e","#fa7d5e","#f97b5d","#f9795d","#f9785d","#f8765c","#f8745c","#f7725c","#f7705c","#f66e5c","#f66c5c","#f56b5c","#f4695c","#f4675c","#f3655c","#f2645c","#f2625d","#f1605d","#f05f5e","#ef5d5e","#ee5b5e","#ed5a5f","#ec5860","#eb5760","#ea5661","#e95462","#e85362","#e75263","#e55064","#e44f64","#e34e65","#e24d66","#e04c67","#df4a68","#de4968","#dc4869","#db476a","#d9466b","#d8456c","#d6456c","#d5446d","#d3436e","#d2426f","#d0416f","#cf4070","#cd4071","#cc3f71","#ca3e72","#c83e73","#c73d73","#c53c74","#c43c75","#c23b75","#c03a76","#bf3a77","#bd3977","#bc3978","#ba3878","#b83779","#b73779","#b5367a","#b3367a","#b2357b","#b0357b","#ae347b","#ad347c","#ab337c","#aa337d","#a8327d","#a6317d","#a5317e","#a3307e","#a1307e","#a02f7f","#9e2f7f","#9c2e7f","#9b2e7f","#992d80","#982d80","#962c80","#942c80","#932b80","#912b81","#902a81","#8e2a81","#8c2981","#8b2981","#892881","#882781","#862781","#842681","#832681","#812581","#802582","#7e2482","#7c2382","#7b2382","#792282","#782281","#762181","#752181","#732081","#721f81","#701f81","#6e1e81","#6d1d81","#6b1d81","#6a1c81","#681c81","#671b80","#651a80","#641a80","#621980","#601880","#5f187f","#5d177f","#5c167f","#5a167e","#59157e","#57157e","#56147d","#54137d","#52137c","#51127c","#4f127b","#4e117b","#4c117a","#4a1079","#491078","#471078","#451077","#440f76","#420f75","#400f74","#3f0f72","#3d0f71","#3b0f70","#390f6e","#38106c","#36106b","#341069","#331067","#311165","#2f1163","#2d1161","#2c115f","#2a115c","#29115a","#271258","#251255","#241253","#221150","#21114e","#20114b","#1e1149","#1d1147","#1c1044","#1a1042","#19103f","#180f3d","#160f3b","#150e38","#140e36","#130d34","#120d31","#110c2f","#100b2d","#0e0b2b","#0d0a29","#0c0926","#0b0924","#0a0822","#090720","#08071e","#07061c","#06051a","#060518","#050416","#040414","#030312","#03030f","#02020d","#02020b","#020109","#010108","#010106","#010005","#000004"]

export const redBlue = ["#67001f","#6a011f","#6d0220","#700320","#730421","#760521","#790622","#7b0722","#7e0823","#810923","#840a24","#870b24","#8a0c25","#8c0d26","#8f0f26","#921027","#941127","#971228","#9a1429","#9c1529","#9f172a","#a1182b","#a41a2c","#a61c2d","#a81d2d","#aa1f2e","#ad212f","#af2330","#b12531","#b32732","#b52933","#b72b34","#b82e35","#ba3036","#bc3238","#be3539","#bf373a","#c13a3b","#c33c3d","#c43f3e","#c6413f","#c74441","#c94742","#ca4943","#cc4c45","#cd4f46","#ce5248","#d0544a","#d1574b","#d25a4d","#d45d4e","#d56050","#d66252","#d86554","#d96855","#da6b57","#db6d59","#dd705b","#de735d","#df755f","#e07861","#e17b63","#e27d65","#e48067","#e58369","#e6856b","#e7886d","#e88b6f","#e98d71","#ea9073","#eb9276","#ec9578","#ed977a","#ee9a7c","#ee9c7f","#ef9f81","#f0a183","#f1a486","#f2a688","#f2a88b","#f3ab8d","#f4ad90","#f4af92","#f5b295","#f5b497","#f6b69a","#f6b89c","#f7ba9f","#f7bda1","#f8bfa4","#f8c1a6","#f8c3a9","#f9c5ab","#f9c7ae","#f9c9b0","#facab3","#faccb5","#faceb8","#fad0ba","#fad2bc","#fad3bf","#fad5c1","#fbd7c4","#fbd8c6","#fbdac8","#fbdbca","#fbddcc","#fadecf","#fae0d1","#fae1d3","#fae2d5","#fae3d7","#fae5d8","#fae6da","#f9e7dc","#f9e8de","#f9e9e0","#f8eae1","#f8eae3","#f7ebe4","#f7ece6","#f6ede7","#f6ede8","#f5eee9","#f4eeeb","#f4efec","#f3efed","#f2efed","#f1efee","#f0f0ef","#eff0f0","#eef0f0","#edf0f1","#eceff1","#ebeff1","#eaeff2","#e9eff2","#e7eef2","#e6eef2","#e5edf2","#e3edf2","#e2ecf2","#e0ecf2","#dfebf2","#ddeaf2","#dbeaf1","#dae9f1","#d8e8f1","#d6e7f0","#d4e6f0","#d3e6f0","#d1e5ef","#cfe4ef","#cde3ee","#cbe2ee","#c9e1ed","#c7e0ed","#c5dfec","#c2ddec","#c0dceb","#bedbea","#bcdaea","#bad9e9","#b7d8e8","#b5d7e8","#b2d5e7","#b0d4e6","#aed3e6","#abd1e5","#a9d0e4","#a6cfe3","#a3cde3","#a1cce2","#9ecae1","#9cc9e0","#99c7e0","#96c6df","#93c4de","#91c3dd","#8ec1dc","#8bc0db","#88beda","#85bcd9","#83bbd8","#80b9d7","#7db7d7","#7ab5d6","#77b3d5","#74b2d4","#71b0d3","#6faed2","#6cacd1","#69aad0","#66a8cf","#64a7ce","#61a5cd","#5ea3cc","#5ba1cb","#599fca","#569dc9","#549bc8","#5199c7","#4f98c6","#4d96c5","#4b94c4","#4892c3","#4690c2","#448ec1","#428cc0","#408bbf","#3e89be","#3d87bd","#3b85bc","#3983bb","#3781ba","#3680b9","#347eb7","#337cb6","#317ab5","#3078b4","#2e76b2","#2d75b1","#2c73b0","#2a71ae","#296fad","#286dab","#266baa","#2569a8","#2467a6","#2365a4","#2164a2","#2062a0","#1f609e","#1e5e9c","#1d5c9a","#1b5a98","#1a5895","#195693","#185490","#17528e","#164f8b","#154d89","#134b86","#124983","#114781","#10457e","#0f437b","#0e4178","#0d3f75","#0c3d73","#0a3b70","#09386d","#08366a","#073467","#063264","#053061"]

export const manualIntervals = {
    PRECIP: {
        2: [0],
        3: [0, 5],
        4: [0, 1, 10]
    },
    WIND: {
        2: [30],
        3: [30, 50],
        4: [30, 50, 100]
    },
    COVID: {
        6: [1, 10, 100, 1000, 10000, 100000, 1000000],
        256: [1, 10, 100, 1000, 10000, 100000, 1000000]
    },
    TRADE: {
        7: [1000000, 10000000, 20000000, 40000000, 80000000, 160000000, 320000000, 640000000],
        256: [1, 10, 100, 1000, 10000, 100000, 1000000]
    },
    BRIDGE: {
        6: [0, 10, 50, 100, 200, 300, 400],
    }
}

export const shapes = {
    SPIRAL: { id: 1, name: "Spiral" },
    ROW: { id: 2, name: "Row" },
}

export const encodings = {
    DISTANCE: { id: 1, name: "Distance" },
    COLOUR: { id: 2, name: "Colour" },
    DISTANCE_COLOUR: {id: 3, name: "Distance and Colour"},
}

export const dataSets = {
    TEMP: { id: 1, name: 'Average Temperature', val: 'TEMP' },
    WIND: { id: 2, name: 'Wind', val: 'WIND' },
    PRECIP: { id: 3, name: 'Precipitation', val: 'PRECIP' },
    COVID: { id: 4, name: 'Covid', val: 'COVID' },
    TRADE: { id: 5, name: 'Trade', val: 'TRADE' },
    MIGRATION: {id: 6, name: 'Migration', val: 'MIGRATION'}
}

export const views = {
    COMPARISON: { id: 1, name: 'Comparison', val: 'COMPARISON' },
    MAP: { id: 2, name: 'Map', val: 'MAP' },
    SCATTER: { id: 3, name: 'Scatter Plot', val: 'SCATTER' },
    GRAPH: { id: 4, name: 'Graph', val: 'GRAPH' },
    MULTI_COMPARISON: {id: 5, name: 'Multi Comparison', val: 'MULTI_COMPARISON'},
    MIGRATION_GRAPH: {id: 6, name: "Migration Graph", val: "MIGRATION_GRAPH"}
}

export const yearIndicators = {
    COLOURS: { id: 1, name: 'Colour Line', val: 'COLOURS' },
    MONTHS: { id: 2, name: 'Month Names', val: 'MONTHS' },
    TICKS: { id: 3, name: 'Tick Marks', val: 'TICKS' },
    MONTHS_TICKS: { id: 4, name: 'Months and Ticks', val: 'MONTHS_TICKS' }
}