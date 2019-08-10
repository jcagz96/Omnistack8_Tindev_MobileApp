import { createAppContainer, createSwitchNavigator } from 'react-navigation'

// createSwitchNavigator - nao permite voltar atrás na navegação
// createSwitchNavigator - permite voltar atrás na navegação
// ver outros existem mais opções


import Login from './pages/Login'
import Main from './pages/Main'

export default createAppContainer(
    createSwitchNavigator({
        Login,
        Main,
    })
)