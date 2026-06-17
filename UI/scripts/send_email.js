// function sendmail(from, to, subject, text)
// {
//     let value = true
//     const transport = window.nodemail.makeTransport(value)
//     window.nodemail.send(transport, from, to, subject, text)
//     console.log('email sent!')
// }

function recordData(from, to, subject, text)
{
    console.log(from)
    console.log(to)
    console.log(subject)
    console.log(text)

    try
    {
        window.nodeFunctions.sendmail(from, to, subject, text)
    }
    catch (err)
    {
        console.log(err)
    }
    

}