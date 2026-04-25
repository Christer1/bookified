import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { BookCardProps } from '@/types'



const BookCard = ({title, author, coverURL, slug}: BookCardProps) => {
  return (
    <Link href={`/books/${slug}`}>
      <article className='book-card'>
        <figure className='book-card-figure'>
            <div className='book-card-image-wrapper'>
                <Image className='book-card-cover' src={coverURL} alt={title} width={133} height={200} />
            </div>
            <figcaption className='book-card-meta'>
                <h3 className='book-card-title'>{title}</h3>
                <p className='book-card-author'>{author}</p> 
            </figcaption>
        </figure>
      </article>
    </Link>
  )
}

export default BookCard