'use client';

import React from 'react';

const Spinner = () => {
	return(
		<div className="loading-container">
			<div className='spinner-container' >
				<img src={'/assets/chip.svg'} alt="Loading..."/>
			</div>
		</div>
	)
}

export default Spinner
