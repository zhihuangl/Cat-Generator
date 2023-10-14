import React, { useState } from "react";

const Bans = ({ bans, setBans }) => {
    const bannedAttributes = Object.keys(bans);

    function removeBan(attribute) {
        let updatedBans = { ...bans };
        delete updatedBans[attribute];
        setBans(updatedBans);
    }

    return (
        <div className="bans">
            <h1>Bans</h1>
            <h3>Select an attribute to ban</h3>
            <div className="ban-container">
                {bannedAttributes.length > 0 ? (
                    bannedAttributes.map((ban, index) => (
                        <button
                            className="catRelated"
                            key={index}
                            onClick={() => removeBan(ban)}
                        >
                            {ban}
                        </button>
                    ))
                ) : (
                    <div>
                        <h3>No bans yet :D</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bans;
