exports.sendTeamsData = (req, res, next) =>{
    const id = req.params.id
    if (typeof(id) === 'undefined') {
        res.send("If id params is not provided then this route sends all teams")
    } else {
        res.send(`This route will provide the details of team ${id}`)
    }
}