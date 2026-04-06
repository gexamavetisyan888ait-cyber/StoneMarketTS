import React from "react";
import { useRealtimeCollection } from "../../lib/hook";
import CompanyCard from "./Companycard";
import SkeletonCard from "./SkeletonCard";
import { Company } from "./types";

export default function Designers() {
    // Հուկին ասում ենք, որ սպասում ենք Company տիպի զանգված
    const { data: companies, loading, error } = useRealtimeCollection<Company>("db/designers");

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 md:px-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-12 tracking-tight">
                    ԴԻԶԱՅՆԵՐՆԵՐ
                </h1>

                {error && (
                    <div className="text-center text-red-500 p-10 bg-red-50 rounded-2xl">
                        Տվյալների բեռնման սխալ։ {error}
                    </div>
                )}

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        companies.map((company) => (
                            <CompanyCard key={company.id} company={company} />
                        ))
                    )}
                </div>

                {!loading && companies.length === 0 && (
                    <div className="text-center text-gray-400 py-20">
                        Տվյալներ չեն գտնվել:
                    </div>
                )}
            </div>
        </div>
    );
}