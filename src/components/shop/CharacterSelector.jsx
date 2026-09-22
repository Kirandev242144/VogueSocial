'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ShopSidebar.module.css';

export default function CharacterSelector({
  characters = [],
  selectedCharacter,
  onSelectCharacter
}) {
  return (
    <div className={styles.characterSection}>
      <span className={styles.sectionHeading}>SELECT CHARACTER</span>
      <div className={styles.characterCarousel}>
        <button type="button" className={styles.carouselNavBtn} aria-label="Previous character">
          <ChevronLeft size={14} />
        </button>
        <div className={styles.charactersList}>
          {characters.map((char) => {
            const isActive = selectedCharacter === char.id;
            return (
              <div
                key={char.id}
                className={`${styles.characterItem} ${isActive ? styles.characterItemActive : ''}`}
                onClick={() => onSelectCharacter(char.id)}
                title={char.description}
              >
                <div className={styles.avatarRing}>
                  <img src={char.avatar} alt={char.name} className={styles.characterImg} />
                </div>
                <span className={styles.characterName}>{char.name}</span>
              </div>
            );
          })}
        </div>
        <button type="button" className={styles.carouselNavBtn} aria-label="Next character">
          <ChevronRight size={14} />
        </button>
      </div>
      {/* Carousel indicator track */}
      <div className={styles.carouselTrack}>
        <div className={styles.carouselProgress} />
      </div>
    </div>
  );
}
