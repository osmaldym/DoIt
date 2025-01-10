enum Api {
    // Root
    base = 'api/v1/',

    // Tasks
    tasks = base + 'tasks/',
    tasksSearch = tasks + 'search/',
    
    // Categories or tags
    categories = base + 'categories/',

    // Auth
    auth = base + 'auth/',

    logIn = auth + 'login',
    signIn = auth + 'signin',
    profile = auth + 'profile',
}

export default Api;