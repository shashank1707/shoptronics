import React from 'react'

function IconBadge({count}) {

    if(count <= 0){
        return <div style={{height: '12px', width: '12px', backgroundColor: 'transparent', borderRadius: '50px', position: 'relative', bottom: '10px', right: '5px'}}></div>
    }

    return (
        <div style={{height: '12px', width: '12px', backgroundColor: 'red', borderRadius: '50px', position: 'relative', bottom: '25px', left: '15px'}}>
            <p style={{fontSize: 10}}>{count}</p>
        </div>
    )
}

export default IconBadge
