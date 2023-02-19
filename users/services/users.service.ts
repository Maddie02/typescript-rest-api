import UsersDao from '../daos/users.dao'
import { CRUD } from '../../common/interfaces/crud.interface'
import { CreateUserDto } from '../dto/create.user.dto'
import { PutUserDto } from '../dto/put.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'

class UserService implements CRUD {
    async list(limit: number, page: number) {
        return UsersDao.getUsers()
    }

    async create(resource: any) {
        return UsersDao.addUser(resource)
    }

    async putById(id: string, resource: any) {
        return UsersDao.putUserById(id, resource)
    }

    async readById(id: string) {
        return UsersDao.getUserByid(id)
    }

    async deleteById(id: string) {
        return UsersDao.removeUserById(id)
    }

    async patchById(id: string, resource: any) {
        return UsersDao.patchUserById(id, resource)
    }

    async getUserByEmail(email: string) {
        return UsersDao.getUserByEmail(email)
    }
}

export default new UserService()
