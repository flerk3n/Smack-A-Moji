export const theme = {
  colors: {
    primary: '#FF6B6B',
    secondary: '#FFE4E1',
    background: '#FFE4E1',
    text: '#222',
    white: '#fff',
    shadow: '#333',
    warning: '#FF0000',
    orange: '#FF8C00',
    success: '#4ECDC4',
    accent: '#45B7D1',
  },
  fonts: {
    regular: 'Poppins-Regular',
    bold: 'Poppins-Bold',
  },
  spacing: {
    xs: 4,
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 40,
  },
  borderRadius: {
    small: 5,
    medium: 10,
    large: 20,
    xlarge: 25,
    round: 50,
  },
  animations: {
    fast: 150,
    normal: 200,
    slow: 500,
    bounce: {
      tension: 120,
      friction: 4,
    },
  },
  sounds: {
    background: require('../assets/sounds/background.mp3'),
    molePop: require('../assets/sounds/mole_pop.mp3'),
    impact: require('../assets/sounds/impact.mp3'),
    scoreScreen: require('../assets/sounds/score_screen.mp3'),
  },
}; 