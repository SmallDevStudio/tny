import { useRef } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from '@/styles/slide.module.css';

const slideItems = [
    { id: 1, image: "/images/slide/1.png" },
];

export default function Carousel() {
    const sliderRef = useRef(null);

    const settings = {
        accessibility: true,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        cssEase: 'linear',
        lazyLoad: 'ondemand',
    };

    return (
        <div className="relative w-full">
            <Slider {...settings} className={styles.slider}>
                {slideItems.map((item) => (
                    <div key={item.id} className="w-full">
                        <Image 
                            src={item.image} 
                            alt={`Slide ${item.id}`} 
                            width={1500}
                            height={1500}
                            className="relative w-full object-cover"
                            loading="lazy"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}
