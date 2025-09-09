

function createError(error)
{
    return {status:'error',error}
}

function createSuccess(data)
{
    return {status:'success',data}
}

function createResult(error,data)
{
    return error ? createError(error): createSuccess(data)
}

module.exports={
    createError,
    createSuccess,
    createResult,
}