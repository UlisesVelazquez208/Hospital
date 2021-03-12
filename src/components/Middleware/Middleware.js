import router from "../../router";
import store from "../../store/store";

class Middleware {

    middleware(route, next) {

        let user = store.state.user, status = true;

        if (!Object.keys(user).length) {
            user = JSON.parse(localStorage.getItem('user'));
            user = user == undefined ? {} : user;
            store.commit('user', user);
        }

        let currentPath = route.matched[0].path;

        if(!currentPath){
            currentPath = route.path;
        }

        const publicPaths = [
            '/',
            '/login',
            '/register',
            '/forgotpassword',
            '/reset_password/:token'
        ];

        if (!Object.keys(user).length && !publicPaths.includes(currentPath)) {
            router.push({'path': '/login'});
        }

        if (Object.keys(user).length && user.constructor === Object && publicPaths.includes(currentPath)) {
            router.push({'path': '/home'});
        }

        return status;
    }
}

export default new Middleware();
