import layout_routes from './layout'

const routes = [
    {
        path: '/',
        component: resolve => require(['src/layout'], resolve),
        children: layout_routes,
        meta: {
            permissions: [
                {
                    entity: 'User',
                    permission_key: 'SHOW'
                }
            ]
        }
    },
    {
        path: '/search-result',
        component: resolve => require(['components/search-results/result'], resolve),
        meta: {
            title: "Search Results",
        }
    },
    {
        path: '/login',
        component: resolve => require(['pages/login'], resolve),
        meta: {
            title: "Login",
        }
    },
    {
        path: '/forgotpassword',
        component: resolve => require(['pages/forgotpassword'], resolve),
        meta: {
            title: "Forgot Password",
        }
    }, 
    {
        path: '/reset_password/:token',
        component: resolve => require(['pages/reset_password'], resolve),
        meta: {
            title: "Reset Password"
        }
    },
    {
        path: '/500',
        component: resolve => require(['pages/500'], resolve),
        meta: {
            title: "500"
        }
    },
    {
        path: '*',
        component: resolve => require(['pages/404'], resolve),
        meta: {
            title: "404"
        }
    },
    {
        path: '404',
        component: resolve => require(['pages/404'], resolve),
        meta: {
            title: "404"
        }
    }
]
export default routes
