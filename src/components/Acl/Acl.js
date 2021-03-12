import router from "../../router";
import store from "../../store/store";
import API from "../APIs/AbstractAPIs";

class Acl {

    checkCurrentUserLoggedIn(to) {

        let currentUserPermissions = store.state.user.permissions;

        if (!currentUserPermissions && !to.path !== '/login') {
            router.push({'path': '/login'});
            return false;
        }

        return true;
    }

    permissions(to, from) {

        if (!to.meta.permissions || !to.meta.permissions.length) {
            store.commit('categories');
            store.commit("routeChange", "start")
            return true;
        }

        if(!this.checkCurrentUserLoggedIn(to)){
            return true;
        }

        let forbidden = false;
        for (let routePermission of to.meta.permissions) {

            let result = this.userHavePermission(routePermission);

            if (result && routePermission.override) {
                forbidden = false;
                break;
            }

            if (!result  && !routePermission.override) {
                forbidden = true;
            }
        }

        if (forbidden) {
            router.push({'path': '/403?rand='+Math.random()});
        }

        store.commit('categories');
        store.commit("routeChange", "start")
    }

    userHavePermission(routePermission) {

        let currentUserPermissions = store.state.user.permissions;

        if(!currentUserPermissions){
            return false;
        }

        for (let currentUserPermission of currentUserPermissions) {
            if (currentUserPermission['entity_name'] === routePermission.entity && currentUserPermission.permission_key === routePermission.permission_key) {
                return true;
            }
        }

        return false;
    }

    currenUserID() {
        return store.state.user.id;
    }

    currentUserCan(permission, entity) {

        return this.userHavePermission({
            entity: entity,
            permission_key: permission
        });
    }

    canViewMenu(item) {

        let allowed, anyOfIt = item.any_of_it ? item.any_of_it : false;

        if (!item.permissions || !item.permissions.length) {
            return true;
        }

        let currentUserPermissions = store.state.user.permissions;

        if (!currentUserPermissions) {
            router.push({'path': '/login'});
            return true;
        }

        // return this.currentUserCan('LIST', item.permissions[0].entity);

        for (let i in item.permissions) {

            let permission = item.permissions[i];

            allowed = this.userHavePermission(permission);

            if (!anyOfIt && !allowed)
                return false;

            if (anyOfIt && allowed) {
                return true;
            }
        }

        return !anyOfIt;
    }

    updateCurrentUser() {
        let userStored = store.state.user;

        let user = {
            name: "",
            picture: require("img/authors/default_user.png"),
            job: "",
            token_type: userStored.token_type,
            access_token: userStored.access_token,
            refresh_token: userStored.refresh_token,
            language_id:userStored.language_id
        };

        let currentUserAPI = new API();
        currentUserAPI.createEntity({name: 'api/me'});
        currentUserAPI.endpoints.get().then((response) => {
            user.id = response.data.id;
            user.name = response.data.first_name + " " + response.data.last_name;
            user.permissions = response.data.permissions
            user.picture = response.data.avatar ? response.data.avatar : require("img/authors/default_user.png");
            user.language_id = response.data.language_id;

            localStorage.setItem('user', JSON.stringify(user));

            store.commit('user', user);
        });
    }
}

export default new Acl();
