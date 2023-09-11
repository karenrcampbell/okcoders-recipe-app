import { inter } from '@/lib/theme'
import { Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Recipe() {
    const router = useRouter()
    const { id } = router.query
    const [recipe, setRecipe] = useState({})
    const [loading, setLoading] = useState(false)
    const [prepTimeDisplay, setPrepTimeDisplay] = useState('')
    const [cookTimeDisplay, setCookTimeDisplay] = useState('')
    const [totalTimeDisplay, setTotalTimeDisplay] = useState('')

    const getRecipe = async () => {
        setLoading(true)
        const response = await fetch(`/api/recipes/${id}`)
        const data = await response.json()
        setRecipe(data.recipe)
        setLoading(false)
        console.log(recipe)
        return
    }

    useEffect(() => {
        if (!id) return
        getRecipe()
    }, [id])

    const setPrepTime = () => {
        const { hours, minutes } = recipe.prepTime
        if (hours === 0) {
            setPrepTimeDisplay(`${minutes} minutes`)
        } else if (minutes === 0) {
            setPrepTimeDisplay(`${hours} hours`)
        } else {
            setPrepTimeDisplay(`${hours} hours ${minutes} minutes`)
        }
    }

    const setCookTime = () => {
        const { hours, minutes } = recipe.cookTime
        if (hours === 0) {
            setCookTimeDisplay(`${minutes} minutes`)
        } else if (minutes === 0) {
            setCookTimeDisplay(`${hours} hours`)
        } else {
            setCookTimeDisplay(`${hours} hours ${minutes} minutes`)
        }
    }

    const setTotalTime = () => {
        const { hours: prepHours, minutes: prepMinutes } = recipe.prepTime
        const { hours: cookHours, minutes: cookMinutes } = recipe.cookTime
        const totalHours = prepHours + cookHours
        const totalMinutes = prepMinutes + cookMinutes
        if (totalHours === 0) {
            setTotalTimeDisplay(`${totalMinutes} minutes`)
        } else if (totalMinutes === 0) {
            setTotalTimeDisplay(`${totalHours} hours`)
        } else {
            setTotalTimeDisplay(`${totalHours} hours ${totalMinutes} minutes`)
        }
    }

    useEffect(() => {
        if (!recipe?._id) return
        setPrepTime()
        setCookTime()
        setTotalTime()
    }, [recipe])

    return (
        <div className={`${inter.className}`}>
            {loading && <h1>Loading...</h1>}
            {!recipe?._id && !loading && (
                <Typography>Listing not found</Typography>
            )}
            {recipe?._id && (
                <>
                    <Image
                        style={{ objectFit: 'cover', borderRadius: 6 }}
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        width={400}
                        height={300}
                    />
                    <h1>{recipe.name}</h1>
                    <p>{recipe.description}</p>
                    <h2>Info</h2>
                    <p>Prep Time: {prepTimeDisplay}</p>
                    <p>Cook Time: {cookTimeDisplay}</p>
                    <p>Total Time: {totalTimeDisplay}</p>
                    <p>
                        Servings: {recipe.servings.amount}{' '}
                        {recipe.servings.unit}
                    </p>
                    <h2>Ingredients</h2>
                    {recipe.ingredients.map((ingredient) => (
                        <div key={ingredient._id}>
                            <p>
                                {ingredient.amount} {ingredient.unit}{' '}
                                {ingredient.name}
                            </p>
                        </div>
                    ))}
                    <h2>Instructions</h2>
                    {recipe.instructions.map((instruction) => (
                        <div key={`${recipe._id}-instructions`}>
                            <p>{instruction}</p>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}