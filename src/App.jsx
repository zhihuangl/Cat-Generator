import React from "react";
import Gallery from "./components/gallery";
import { useState } from "react";
import Bans from "./components/bans";
import catNames from './components/cat-names.json';
import './App.css'
//const theCatAPIKey = import.meta.env.THE_CAT_API_KEY;

const Discover = () => {
    const [previousImages, setPreviousImages] = useState([]);
    const [toBans, setToBans] = useState({});
    const [catInfo, setCatInfo] = useState({
        img: "",
        name: "",
        breed: "",
        weight: "",
        origin: "",
        lifespan: "",
        description: ""
    });

    async function getRandomCatInfo() {
        if (catInfo.img != "") {
            setPreviousImages((images) => [...images, catInfo.img]);
        }
        try {
            let catInfo;
            do {
                const breed = await getRandomBreed();
                const catID = await getCatID(breed.breedID);
                const catData = await getCatData(catID);
                catInfo = processCatData(catData, breed);
            } while (!catInfo);

            if (catInfo) {
                setCurrentCatInfo(catInfo);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async function getRandomBreed() {
        const breedsDataFetch = await fetch('https://api.thecatapi.com/v1/breeds');
        if (!breedsDataFetch.ok) {
            throw new Error('Failed to fetch breeds information');
        }
        const breedsData = await breedsDataFetch.json();
        const breeds = breedsData.map(breed => ({
            breedID: breed.id,
            breedName: breed.name,
        }));

        let randomBreedIndex = Math.floor(Math.random() * breeds.length);
        let breed = breeds[randomBreedIndex].breedName;
        while (toBans[breed]) {
            randomBreedIndex = Math.floor(Math.random() * breeds.length);
            breed = breeds[randomBreedIndex].breedName;
        }

        return {
            breedID: breeds[randomBreedIndex].breedID,
            breedName: breed,
        };
    }

    async function getCatID(breedID) {
        const catIDDataFetch = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedID}`);
        if (!catIDDataFetch.ok) {
            throw new Error('Failed to fetch random breed information');
        }
        const catIDData = await catIDDataFetch.json();
        return catIDData[0].id;
    }

    async function getCatData(catID) {
        const catDataFetch = await fetch(`https://api.thecatapi.com/v1/images/${catID}`);
        if (!catDataFetch.ok) {
            throw new Error('Failed to fetch cat info');
        }
        return catDataFetch.json();
    }

    function processCatData(catData, breed) {
        const img = catData.url;
        const description = catData.breeds[0]?.description;
        const origin = catData.breeds[0]?.origin;
        const weight = catData.breeds[0]?.weight.imperial + ' lbs';
        const lifespan = catData.breeds[0]?.life_span + ' years';
        const randomNameIndex = Math.floor(Math.random() * catNames.length);

        if (!(toBans[origin] || toBans[weight] || toBans[lifespan])) {
            return {
                name: catNames[randomNameIndex],
                description,
                weight,
                lifespan,
                origin,
                img,
                breed: breed.breedName,
            };
        }
        return null;
    }

    function setCurrentCatInfo(catInfo) {
        setCatInfo({
            img: catInfo.img,
            name: catInfo.name,
            breed: catInfo.breed,
            weight: catInfo.weight,
            origin: catInfo.origin,
            lifespan: catInfo.lifespan,
            description: catInfo.description
        });
    }

    const addToBanList = (attribute) => {
        if (!toBans[attribute]) {
            setToBans(prevBans => ({
                ...prevBans,
                [attribute]: true
            }));
        } else {
            alert(`${attribute} is already banned.`);
        }
    };

    function renderButton(label, attribute) {
        return attribute ? (
            <button className="catRelated" onClick={() => { addToBanList(attribute) }}>
                {label}: {attribute}
            </button>
        ) : (
            <div> </div>
        );
    }

    function renderImage(imageUrl) {
        return imageUrl ? (
            <img
                className="catImage"
                src={imageUrl}
            />
        ) : (
            <div> </div>
        );
    }

    function TruncatedParagraph({ text, limit }) {
        const [isExpanded, setIsExpanded] = useState(false);
        const toggleExpansion = () => {
            setIsExpanded(!isExpanded);
        };
        if (text.length <= limit) {
            return <p>{text}</p>;
        }
        const displayText = (isExpanded ? text : text.slice(0, limit)) + "...";
        return (
            <div>
                <p>{displayText}</p>
                {text.length > limit && (
                    <p onClick={() => { toggleExpansion() }} style={{ cursor: 'pointer', color: 'purple' }}>
                        {isExpanded ? 'Read Less' : 'Read More'}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className='container'>
            <Gallery images={previousImages}/>
            <div className="discovery">
                <h1>Trippin' on Cats</h1>
                <h3>Discover random cats :&#41;</h3>
                <div className='attributes'>
                    {catInfo.name && <h2>{catInfo.name}</h2>}
                    {catInfo.description && <TruncatedParagraph text={catInfo.description} limit={100} />}
                    {renderButton('Breed', catInfo.breed)}
                    {renderButton('Origin', catInfo.origin)}
                    {renderButton('Weight', catInfo.weight)}
                    {renderButton('Life Span', catInfo.lifespan)}
                    <div>
                        {renderImage(catInfo.img)}
                    </div>
                </div>
                <button className="catRelated" onClick={getRandomCatInfo}>🐈Discover🐈</button>
            </div>
            <Bans bans={toBans} setBans={setToBans} />
        </div>
    );
};
export default Discover