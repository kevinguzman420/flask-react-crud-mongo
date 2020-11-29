import React from 'react';

const API = process.env.REACT_APP_API;

class Users extends React.Component {

    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            users: [],
            updateUser: false,
            idUser: ''
        }
    }

    // Change the state of the input
    onChange = (e) => {
        switch (e.target.name) {
            case 'name':
                this.setState({name: e.target.value})
                break;
            case 'email':
                this.setState({email: e.target.value})
                break;
            default:
                this.setState({password: e.target.value})
                break;
        }
        // console.log(this.state.name)
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        // Create user
       if(!this.state.updateUser) {
           const res = await fetch(`${API}/users/`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        name: this.state.name,
                        email: this.state.email,
                        password: this.state.password
                    }
                )
            })
            const data = await res.json();
            this.setState({name: '', email: '', password:'', users: data})

        } else { // Update user
            const res = await fetch(`${API}/user/${this.state.idUser}`, {
                method: "PUT",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        name: this.state.name,
                        email: this.state.email,
                        password: this.state.password
                    }
                )
            })
            const data = await res.json();
            console.log(data.message)
            this.setState({
                    name: '', 
                    email: '', 
                    password:'', 
                    updateUser: false,
                    idUser: ''
                }
            )
            this.componentDidMount();
        }
    }

    // DELETE USER
    async toDelete(id) {
        let res = window.confirm("Are you sure you want to delete this user?")
        if (res) {
            const res = await fetch(`${API}/user/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json()
            console.log(data.message)
            this.componentDidMount();
            // const data = res.json()
            // this.setState({
            //     users: data
            // })
        }
    }

    // UPDATE USER
    async upDate(id) {

        // Get an user by id
        const res = await fetch(`${API}/user/${id}`)
        const user = await res.json();
        this.setState({
                name: user.name, 
                email: user.email,
                password: user.password,
                updateUser: true,
                idUser: id
            }
        )       
    }

    async componentDidMount() {
        const res = await fetch(`${API}/users/`)
        const users = await res.json()
        this.setState({users: users})
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <form onSubmit={this.handleSubmit} className="card card-body">
                        <div className="form-group">
                            <input
                                type="text"
                                onChange={this.onChange}
                                value={this.state.name}
                                className="form-control"
                                placeholder="Insert a name"
                                name="name"
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                onChange={this.onChange}
                                value={this.state.email}
                                className="form-control"
                                placeholder="Insert a email"
                                name="email"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                onChange={this.onChange}
                                value={this.state.password}
                                className="form-control"
                                placeholder="Insert a password"
                                name="password"
                            />
                        </div>
                        <button className="btn btn-primary btn-block">
                            {this.state.updateUser ? "UPDATE" : "CREATE"}
                        </button>
                    </form>
                </div>
                <div className="col-md-8">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Password</th>
                            <th scope="col">Operations</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.state.users.length > 0 && 
                                this.state.users.map((user) =>  {
                                    return (
                                        [
                                        <tr key={user.password}>
                                            <td>{user['name']}</td>
                                            <td>{user.email}</td>
                                            <td>{user.password}</td>
                                            <th>
                                                <div className="form-group">
                                                    <button 
                                                        className="btn btn-danger btn-block" 
                                                        onClick={this.toDelete.bind(this, user['_id'])}
                                                    >
                                                        DELETE
                                                    </button>
                                                    <button 
                                                        className="btn btn-primary btn-block"
                                                        onClick={this.upDate.bind(this, user['_id'])}
                                                    >
                                                        UPDATE
                                                    </button>
                                                </div>
                                            </th>
                                        </tr>
                                        ]
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Users;