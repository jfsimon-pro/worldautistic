'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect, ComponentType } from 'react';
import PageLayout from '../../components/PageLayout';
import { ActivityProvider } from '../../components/ActivityContext';
import AnswerModal from '../../components/AnswerModal';
import styles from '../../styles/Activity.module.css';

// Import activities
import MATH01 from '../../components/activities/math01';
import MATH02 from '../../components/activities/math02';
import MATH03 from '../../components/activities/math03';
import MATH04 from '../../components/activities/math04';
import MATH05 from '../../components/activities/math05';
import MATH06 from '../../components/activities/math06';
import LANG01 from '../../components/activities/lang01';
import LANG03 from '../../components/activities/lang03';
import LANG04 from '../../components/activities/lang04';

type ActivityComponent = ComponentType;
type ActivitiesByLevel = Record<number, ActivityComponent[]>;
type ActivitiesByCategory = Record<string, ActivitiesByLevel>;

const MAX_ACTIVITY_COUNT = 5;

const activitiesByCategory: ActivitiesByCategory = {
    math: {
        1: [MATH01, MATH02, MATH03, MATH04, MATH05, MATH06],
        2: [MATH01, MATH02, MATH03, MATH04, MATH05, MATH06],
        3: [MATH01, MATH02, MATH03, MATH04, MATH05, MATH06],
    },
    lang: {
        1: [LANG01, LANG03, LANG04],
    },
};

function getRandomActivity(category: string, level: number): ActivityComponent | null {
    const categoryActivities = activitiesByCategory[category] || {};
    const activities = categoryActivities[level] || [];
    if (activities.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * activities.length);
    return activities[randomIndex];
}

function ActivityContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get('category') || 'math';
    const level = parseInt(searchParams.get('level') || '1', 10);

    const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
    const [count, setCount] = useState<number>(0);
    const [currentActivity, setCurrentActivity] = useState<ActivityComponent | null>(null);

    const changeActivity = () => {
        try {
            const activity = getRandomActivity(category, level);
            setCount((prevCount) => prevCount + 1);
            if (count < MAX_ACTIVITY_COUNT) {
                setCurrentActivity(() => activity);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        changeActivity();
    }, [category, level]);

    const handleModalClose = () => {
        if (result === "correct") {
            if (count >= MAX_ACTIVITY_COUNT) {
                router.push('/activities');
            } else {
                changeActivity();
            }
        }
        setResult(null);
    };

    const ActivityComponent = currentActivity;

    return (
        <ActivityProvider result={result} setResult={setResult}>
            <div className={styles.whiteCard}>
                <div className={styles.cardHeader}>
                    <div className={styles.counter}>{count}/{MAX_ACTIVITY_COUNT}</div>
                </div>

                <div className={styles.activityContainer}>
                    {ActivityComponent && <ActivityComponent key={count} />}
                </div>
            </div>

            {result && <AnswerModal result={result} handleModalClose={handleModalClose} />}
        </ActivityProvider>
    );
}

export default function ActivityPage() {
    return (
        <PageLayout backHref="/activities">
            <Suspense fallback={<div>Carregando...</div>}>
                <ActivityContent />
            </Suspense>
        </PageLayout>
    );
}
