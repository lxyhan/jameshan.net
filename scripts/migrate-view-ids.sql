-- Migration: Add view_id column and backfill from legacy page_paths
-- Run this in Supabase SQL Editor
-- Generated 2026-03-26T14:07:45.354746

BEGIN;

-- Step 1: Add view_id column
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS view_id INTEGER;

-- Step 2: Create index
CREATE INDEX IF NOT EXISTS idx_page_views_view_id ON page_views(view_id);

-- Step 3: Backfill view_id from page_path
-- Normalizes paths (strips leading/trailing slashes) and maps to viewIds

-- viewId 1: _drafts/eight_months_in_sds
UPDATE page_views SET view_id = 1
WHERE view_id IS NULL AND page_path IN (
  '/department-of-computer-science/0_eight_months_in_sds', '/department-of-computer-science/0_eight_months_in_sds/', 'department-of-computer-science/0_eight_months_in_sds', 'department-of-computer-science/0_eight_months_in_sds/'
);

-- viewId 2: _drafts/reflections
UPDATE page_views SET view_id = 2
WHERE view_id IS NULL AND page_path IN (
  '/department-of-computer-science/9_reflections', '/department-of-computer-science/9_reflections/', 'department-of-computer-science/9_reflections', 'department-of-computer-science/9_reflections/'
);

-- viewId 3: _drafts/top_5_albums
UPDATE page_views SET view_id = 3
WHERE view_id IS NULL AND page_path IN (
  '/books/2_top_5_albums', '/books/2_top_5_albums/', '/essays/top_5_albums', '/essays/top_5_albums/', '/movies/2_top_5_albums', '/movies/2_top_5_albums/', 'books/2_top_5_albums', 'books/2_top_5_albums/', 'essays/top_5_albums', 'essays/top_5_albums/', 'movies/2_top_5_albums', 'movies/2_top_5_albums/'
);

-- viewId 4: _statistics/10_inference_for_linear_models
UPDATE page_views SET view_id = 4
WHERE view_id IS NULL AND page_path IN (
  '/statistics/10_inference_linear_models', '/statistics/10_inference_linear_models/', 'statistics/10_inference_linear_models', 'statistics/10_inference_linear_models/'
);

-- viewId 5: _statistics/1_probability_review
UPDATE page_views SET view_id = 5
WHERE view_id IS NULL AND page_path IN (
  '/statistical-inference/0_preface', '/statistical-inference/0_preface/', '/statistics/01_probability_review', '/statistics/01_probability_review/', '/statistics/0_preface', '/statistics/0_preface/', 'statistical-inference/0_preface', 'statistical-inference/0_preface/', 'statistics/01_probability_review', 'statistics/01_probability_review/', 'statistics/0_preface', 'statistics/0_preface/'
);

-- viewId 6: _statistics/2_statistical_models
UPDATE page_views SET view_id = 6
WHERE view_id IS NULL AND page_path IN (
  '/statistics/02_statistical_models', '/statistics/02_statistical_models/', 'statistics/02_statistical_models', 'statistics/02_statistical_models/'
);

-- viewId 7: _statistics/3_estimators_and_properties
UPDATE page_views SET view_id = 7
WHERE view_id IS NULL AND page_path IN (
  '/statistics/03_estimators_properties', '/statistics/03_estimators_properties/', 'statistics/03_estimators_properties', 'statistics/03_estimators_properties/'
);

-- viewId 8: _statistics/4_method_of_moments
UPDATE page_views SET view_id = 8
WHERE view_id IS NULL AND page_path IN (
  '/statistics/04_method_of_moments', '/statistics/04_method_of_moments/', 'statistics/04_method_of_moments', 'statistics/04_method_of_moments/'
);

-- viewId 9: _statistics/5_maximum_likelihood_estimation
UPDATE page_views SET view_id = 9
WHERE view_id IS NULL AND page_path IN (
  '/statistics/05_maximum_likelihood', '/statistics/05_maximum_likelihood/', 'statistics/05_maximum_likelihood', 'statistics/05_maximum_likelihood/'
);

-- viewId 10: _statistics/6_confidence_intervals
UPDATE page_views SET view_id = 10
WHERE view_id IS NULL AND page_path IN (
  '/statistics/06_confidence_intervals', '/statistics/06_confidence_intervals/', 'statistics/06_confidence_intervals', 'statistics/06_confidence_intervals/'
);

-- viewId 11: _statistics/7_hypothesis_testing
UPDATE page_views SET view_id = 11
WHERE view_id IS NULL AND page_path IN (
  '/statistics/07_hypothesis_testing', '/statistics/07_hypothesis_testing/', 'statistics/07_hypothesis_testing', 'statistics/07_hypothesis_testing/'
);

-- viewId 12: _statistics/8_likelihood_ratio_tests
UPDATE page_views SET view_id = 12
WHERE view_id IS NULL AND page_path IN (
  '/statistics/08_likelihood_ratio_tests', '/statistics/08_likelihood_ratio_tests/', 'statistics/08_likelihood_ratio_tests', 'statistics/08_likelihood_ratio_tests/'
);

-- viewId 13: _statistics/9_the_linear_model
UPDATE page_views SET view_id = 13
WHERE view_id IS NULL AND page_path IN (
  '/statistics/09_linear_model', '/statistics/09_linear_model/', 'statistics/09_linear_model', 'statistics/09_linear_model/'
);

-- viewId 14: changelog
UPDATE page_views SET view_id = 14
WHERE view_id IS NULL AND page_path IN (
  '/changelog', '/changelog/', 'changelog', 'changelog/'
);

-- viewId 15: data-structures-and-algorithms/10_greedy_algorithms
UPDATE page_views SET view_id = 15
WHERE view_id IS NULL AND page_path IN (
  '/csc373/1_greedy_algorithms', '/csc373/1_greedy_algorithms/', '/data-structures-and-algorithms/10_greedy_algorithms', '/data-structures-and-algorithms/10_greedy_algorithms/', '/data-structures-and-algorithms/greedy_algorithms', '/data-structures-and-algorithms/greedy_algorithms/', 'csc373/1_greedy_algorithms', 'csc373/1_greedy_algorithms/', 'data-structures-and-algorithms/10_greedy_algorithms', 'data-structures-and-algorithms/10_greedy_algorithms/', 'data-structures-and-algorithms/greedy_algorithms', 'data-structures-and-algorithms/greedy_algorithms/'
);

-- viewId 16: data-structures-and-algorithms/11_dynamic_programming
UPDATE page_views SET view_id = 16
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/11_dynamic_programming', '/data-structures-and-algorithms/11_dynamic_programming/', 'data-structures-and-algorithms/11_dynamic_programming', 'data-structures-and-algorithms/11_dynamic_programming/'
);

-- viewId 17: data-structures-and-algorithms/12_network_flows
UPDATE page_views SET view_id = 17
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/12_network_flows', '/data-structures-and-algorithms/12_network_flows/', 'data-structures-and-algorithms/12_network_flows', 'data-structures-and-algorithms/12_network_flows/'
);

-- viewId 18: data-structures-and-algorithms/13_linear_programming
UPDATE page_views SET view_id = 18
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/13_linear_programming', '/data-structures-and-algorithms/13_linear_programming/', 'data-structures-and-algorithms/13_linear_programming', 'data-structures-and-algorithms/13_linear_programming/'
);

-- viewId 19: data-structures-and-algorithms/14_np_completeness
UPDATE page_views SET view_id = 19
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/14_np_completeness', '/data-structures-and-algorithms/14_np_completeness/', 'data-structures-and-algorithms/14_np_completeness', 'data-structures-and-algorithms/14_np_completeness/'
);

-- viewId 20: data-structures-and-algorithms/15_approximation_algorithms
UPDATE page_views SET view_id = 20
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/15_approximation_algorithms', '/data-structures-and-algorithms/15_approximation_algorithms/', 'data-structures-and-algorithms/15_approximation_algorithms', 'data-structures-and-algorithms/15_approximation_algorithms/'
);

-- viewId 21: data-structures-and-algorithms/16_randomized_algorithms
UPDATE page_views SET view_id = 21
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/16_randomized_algorithms', '/data-structures-and-algorithms/16_randomized_algorithms/', 'data-structures-and-algorithms/16_randomized_algorithms', 'data-structures-and-algorithms/16_randomized_algorithms/'
);

-- viewId 22: data-structures-and-algorithms/1_graphs_and_representations
UPDATE page_views SET view_id = 22
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/01_graphs_and_representations', '/data-structures-and-algorithms/01_graphs_and_representations/', '/data-structures-and-algorithms/graphs_and_representations', '/data-structures-and-algorithms/graphs_and_representations/', 'data-structures-and-algorithms/01_graphs_and_representations', 'data-structures-and-algorithms/01_graphs_and_representations/', 'data-structures-and-algorithms/graphs_and_representations', 'data-structures-and-algorithms/graphs_and_representations/'
);

-- viewId 23: data-structures-and-algorithms/2_graph_search
UPDATE page_views SET view_id = 23
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/02_graph_search', '/data-structures-and-algorithms/02_graph_search/', '/data-structures-and-algorithms/2_graph_search', '/data-structures-and-algorithms/2_graph_search/', '/data-structures-and-algorithms/graph_search', '/data-structures-and-algorithms/graph_search/', 'data-structures-and-algorithms/02_graph_search', 'data-structures-and-algorithms/02_graph_search/', 'data-structures-and-algorithms/2_graph_search', 'data-structures-and-algorithms/2_graph_search/', 'data-structures-and-algorithms/graph_search', 'data-structures-and-algorithms/graph_search/'
);

-- viewId 24: data-structures-and-algorithms/3_minimum_spanning_trees
UPDATE page_views SET view_id = 24
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/03_minimum_spanning_trees', '/data-structures-and-algorithms/03_minimum_spanning_trees/', '/data-structures-and-algorithms/3_minimum_spanning_trees', '/data-structures-and-algorithms/3_minimum_spanning_trees/', '/data-structures-and-algorithms/minimum_spanning_trees', '/data-structures-and-algorithms/minimum_spanning_trees/', 'data-structures-and-algorithms/03_minimum_spanning_trees', 'data-structures-and-algorithms/03_minimum_spanning_trees/', 'data-structures-and-algorithms/3_minimum_spanning_trees', 'data-structures-and-algorithms/3_minimum_spanning_trees/', 'data-structures-and-algorithms/minimum_spanning_trees', 'data-structures-and-algorithms/minimum_spanning_trees/'
);

-- viewId 25: data-structures-and-algorithms/4_union_find
UPDATE page_views SET view_id = 25
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/04_union_find', '/data-structures-and-algorithms/04_union_find/', '/data-structures-and-algorithms/union_find', '/data-structures-and-algorithms/union_find/', 'data-structures-and-algorithms/04_union_find', 'data-structures-and-algorithms/04_union_find/', 'data-structures-and-algorithms/union_find', 'data-structures-and-algorithms/union_find/'
);

-- viewId 26: data-structures-and-algorithms/5_hash_tables
UPDATE page_views SET view_id = 26
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/05_hash_tables', '/data-structures-and-algorithms/05_hash_tables/', '/data-structures-and-algorithms/hash_tables', '/data-structures-and-algorithms/hash_tables/', 'data-structures-and-algorithms/05_hash_tables', 'data-structures-and-algorithms/05_hash_tables/', 'data-structures-and-algorithms/hash_tables', 'data-structures-and-algorithms/hash_tables/'
);

-- viewId 27: data-structures-and-algorithms/6_balanced_binary_search_trees
UPDATE page_views SET view_id = 27
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/06_balanced_bsts', '/data-structures-and-algorithms/06_balanced_bsts/', '/data-structures-and-algorithms/6_balanced_binary_search_trees', '/data-structures-and-algorithms/6_balanced_binary_search_trees/', 'data-structures-and-algorithms/06_balanced_bsts', 'data-structures-and-algorithms/06_balanced_bsts/', 'data-structures-and-algorithms/6_balanced_binary_search_trees', 'data-structures-and-algorithms/6_balanced_binary_search_trees/'
);

-- viewId 28: data-structures-and-algorithms/7_priority_queues_and_heaps
UPDATE page_views SET view_id = 28
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/07_heaps', '/data-structures-and-algorithms/07_heaps/', '/data-structures-and-algorithms/7_priority_queues_and_heaps', '/data-structures-and-algorithms/7_priority_queues_and_heaps/', 'data-structures-and-algorithms/07_heaps', 'data-structures-and-algorithms/07_heaps/', 'data-structures-and-algorithms/7_priority_queues_and_heaps', 'data-structures-and-algorithms/7_priority_queues_and_heaps/'
);

-- viewId 29: data-structures-and-algorithms/8_tries
UPDATE page_views SET view_id = 29
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/08_tries', '/data-structures-and-algorithms/08_tries/', '/data-structures-and-algorithms/8_tries', '/data-structures-and-algorithms/8_tries/', '/data-structures-and-algorithms/tries', '/data-structures-and-algorithms/tries/', 'data-structures-and-algorithms/08_tries', 'data-structures-and-algorithms/08_tries/', 'data-structures-and-algorithms/8_tries', 'data-structures-and-algorithms/8_tries/', 'data-structures-and-algorithms/tries', 'data-structures-and-algorithms/tries/'
);

-- viewId 30: data-structures-and-algorithms/9_divide_and_conquer
UPDATE page_views SET view_id = 30
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/09_divide_and_conquer', '/data-structures-and-algorithms/09_divide_and_conquer/', 'data-structures-and-algorithms/09_divide_and_conquer', 'data-structures-and-algorithms/09_divide_and_conquer/'
);

-- viewId 31: data-structures-and-algorithms/index
UPDATE page_views SET view_id = 31
WHERE view_id IS NULL AND page_path IN (
  '/Data%20Structures%20and%20Algorithms/index', '/Data%20Structures%20and%20Algorithms/index/', '/csc373/0_index', '/csc373/0_index/', '/data-structures-and-algorithms/00_index', '/data-structures-and-algorithms/00_index/', '/data-structures-and-algorithms/0_preface', '/data-structures-and-algorithms/0_preface/', '/data-structures-and-algorithms/index', '/data-structures-and-algorithms/index/', '/data-structures-and-algorithms/preface', '/data-structures-and-algorithms/preface/', 'Data%20Structures%20and%20Algorithms/index', 'Data%20Structures%20and%20Algorithms/index/', 'csc373/0_index', 'csc373/0_index/', 'data-structures-and-algorithms/00_index', 'data-structures-and-algorithms/00_index/', 'data-structures-and-algorithms/0_preface', 'data-structures-and-algorithms/0_preface/', 'data-structures-and-algorithms/index', 'data-structures-and-algorithms/index/', 'data-structures-and-algorithms/preface', 'data-structures-and-algorithms/preface/'
);

-- viewId 32: data-structures-and-algorithms/leetcode-patterns/arrays_and_hashing
UPDATE page_views SET view_id = 32
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/00-leetcode-patterns/01_arrays_and_hashing', '/data-structures-and-algorithms/00-leetcode-patterns/01_arrays_and_hashing/', '/data-structures-and-algorithms/leetcode-patterns/01_arrays_and_hashing', '/data-structures-and-algorithms/leetcode-patterns/01_arrays_and_hashing/', '/data-structures-and-algorithms/leetcode/01_arrays_and_hashing', '/data-structures-and-algorithms/leetcode/01_arrays_and_hashing/', 'data-structures-and-algorithms/00-leetcode-patterns/01_arrays_and_hashing', 'data-structures-and-algorithms/00-leetcode-patterns/01_arrays_and_hashing/', 'data-structures-and-algorithms/leetcode-patterns/01_arrays_and_hashing', 'data-structures-and-algorithms/leetcode-patterns/01_arrays_and_hashing/', 'data-structures-and-algorithms/leetcode/01_arrays_and_hashing', 'data-structures-and-algorithms/leetcode/01_arrays_and_hashing/'
);

-- viewId 33: data-structures-and-algorithms/leetcode-patterns/binary_search
UPDATE page_views SET view_id = 33
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/leetcode-patterns/04_binary_search', '/data-structures-and-algorithms/leetcode-patterns/04_binary_search/', '/data-structures-and-algorithms/leetcode/04_binary_search', '/data-structures-and-algorithms/leetcode/04_binary_search/', 'data-structures-and-algorithms/leetcode-patterns/04_binary_search', 'data-structures-and-algorithms/leetcode-patterns/04_binary_search/', 'data-structures-and-algorithms/leetcode/04_binary_search', 'data-structures-and-algorithms/leetcode/04_binary_search/'
);

-- viewId 34: data-structures-and-algorithms/leetcode-patterns/index
UPDATE page_views SET view_id = 34
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/leetcode-patterns/00_index', '/data-structures-and-algorithms/leetcode-patterns/00_index/', '/data-structures-and-algorithms/leetcode-patterns/index', '/data-structures-and-algorithms/leetcode-patterns/index/', 'data-structures-and-algorithms/leetcode-patterns/00_index', 'data-structures-and-algorithms/leetcode-patterns/00_index/', 'data-structures-and-algorithms/leetcode-patterns/index', 'data-structures-and-algorithms/leetcode-patterns/index/'
);

-- viewId 35: data-structures-and-algorithms/leetcode-patterns/stack
UPDATE page_views SET view_id = 35
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/leetcode-patterns/03_stack', '/data-structures-and-algorithms/leetcode-patterns/03_stack/', '/data-structures-and-algorithms/leetcode-patterns/stack', '/data-structures-and-algorithms/leetcode-patterns/stack/', '/data-structures-and-algorithms/leetcode/03_stack', '/data-structures-and-algorithms/leetcode/03_stack/', 'data-structures-and-algorithms/leetcode-patterns/03_stack', 'data-structures-and-algorithms/leetcode-patterns/03_stack/', 'data-structures-and-algorithms/leetcode-patterns/stack', 'data-structures-and-algorithms/leetcode-patterns/stack/', 'data-structures-and-algorithms/leetcode/03_stack', 'data-structures-and-algorithms/leetcode/03_stack/'
);

-- viewId 36: data-structures-and-algorithms/leetcode-patterns/trees
UPDATE page_views SET view_id = 36
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/leetcode-patterns/06_trees', '/data-structures-and-algorithms/leetcode-patterns/06_trees/', '/data-structures-and-algorithms/leetcode/06_trees', '/data-structures-and-algorithms/leetcode/06_trees/', 'data-structures-and-algorithms/leetcode-patterns/06_trees', 'data-structures-and-algorithms/leetcode-patterns/06_trees/', 'data-structures-and-algorithms/leetcode/06_trees', 'data-structures-and-algorithms/leetcode/06_trees/'
);

-- viewId 37: data-structures-and-algorithms/leetcode-patterns/two_pointers
UPDATE page_views SET view_id = 37
WHERE view_id IS NULL AND page_path IN (
  '/data-structures-and-algorithms/00-leetcode-patterns/02_two_pointers', '/data-structures-and-algorithms/00-leetcode-patterns/02_two_pointers/', '/data-structures-and-algorithms/leetcode-patterns/02_two_pointers', '/data-structures-and-algorithms/leetcode-patterns/02_two_pointers/', '/data-structures-and-algorithms/leetcode-patterns/two_pointers', '/data-structures-and-algorithms/leetcode-patterns/two_pointers/', '/data-structures-and-algorithms/leetcode/02_two_pointers', '/data-structures-and-algorithms/leetcode/02_two_pointers/', 'data-structures-and-algorithms/00-leetcode-patterns/02_two_pointers', 'data-structures-and-algorithms/00-leetcode-patterns/02_two_pointers/', 'data-structures-and-algorithms/leetcode-patterns/02_two_pointers', 'data-structures-and-algorithms/leetcode-patterns/02_two_pointers/', 'data-structures-and-algorithms/leetcode-patterns/two_pointers', 'data-structures-and-algorithms/leetcode-patterns/two_pointers/', 'data-structures-and-algorithms/leetcode/02_two_pointers', 'data-structures-and-algorithms/leetcode/02_two_pointers/'
);

-- viewId 38: effective-goal-setting/_reflection_march_2026
UPDATE page_views SET view_id = 38
WHERE view_id IS NULL AND page_path IN (
  '/effective-goal-setting/_reflection_march_2026', '/effective-goal-setting/_reflection_march_2026/', '/effective-goal-setting/reflection_march_2026', '/effective-goal-setting/reflection_march_2026/', '/essays/reflection_march_2026', '/essays/reflection_march_2026/', 'effective-goal-setting/_reflection_march_2026', 'effective-goal-setting/_reflection_march_2026/', 'effective-goal-setting/reflection_march_2026', 'effective-goal-setting/reflection_march_2026/', 'essays/reflection_march_2026', 'essays/reflection_march_2026/'
);

-- viewId 39: effective-goal-setting/a_model_for_goal_setting
UPDATE page_views SET view_id = 39
WHERE view_id IS NULL AND page_path IN (
  '/effective-goal-setting/a_model_for_goal_setting', '/effective-goal-setting/a_model_for_goal_setting/', '/effective-goal-setting/definitions', '/effective-goal-setting/definitions/', 'effective-goal-setting/a_model_for_goal_setting', 'effective-goal-setting/a_model_for_goal_setting/', 'effective-goal-setting/definitions', 'effective-goal-setting/definitions/'
);

-- viewId 40: effective-goal-setting/fat_tails_in_value
UPDATE page_views SET view_id = 40
WHERE view_id IS NULL AND page_path IN (
  '/effective-goal-setting/choosing-high-ev-goals/identifying_unbounded_upside', '/effective-goal-setting/choosing-high-ev-goals/identifying_unbounded_upside/', '/effective-goal-setting/choosing-high-ev-goals/the_probability_question', '/effective-goal-setting/choosing-high-ev-goals/the_probability_question/', '/effective-goal-setting/choosing-high-ev-goals/the_ratio_problem', '/effective-goal-setting/choosing-high-ev-goals/the_ratio_problem/', '/effective-goal-setting/fat_tails_in_value', '/effective-goal-setting/fat_tails_in_value/', 'effective-goal-setting/choosing-high-ev-goals/identifying_unbounded_upside', 'effective-goal-setting/choosing-high-ev-goals/identifying_unbounded_upside/', 'effective-goal-setting/choosing-high-ev-goals/the_probability_question', 'effective-goal-setting/choosing-high-ev-goals/the_probability_question/', 'effective-goal-setting/choosing-high-ev-goals/the_ratio_problem', 'effective-goal-setting/choosing-high-ev-goals/the_ratio_problem/', 'effective-goal-setting/fat_tails_in_value', 'effective-goal-setting/fat_tails_in_value/'
);

-- viewId 41: effective-goal-setting/index
UPDATE page_views SET view_id = 41
WHERE view_id IS NULL AND page_path IN (
  '/effective-goal-setting', '/effective-goal-setting/', '/effective-goal-setting/00_index', '/effective-goal-setting/00_index/', '/effective-goal-setting/0_preface', '/effective-goal-setting/0_preface/', '/effective-goal-setting/choosing-high-ev-goals', '/effective-goal-setting/choosing-high-ev-goals/', '/effective-goal-setting/choosing-high-ev-goals/00_index', '/effective-goal-setting/choosing-high-ev-goals/00_index/', '/effective-goal-setting/choosing-high-ev-goals/index', '/effective-goal-setting/choosing-high-ev-goals/index/', '/effective-goal-setting/index', '/effective-goal-setting/index/', '/effective-goal-setting/learning-to-fail/index', '/effective-goal-setting/learning-to-fail/index/', 'effective-goal-setting', 'effective-goal-setting/', 'effective-goal-setting/00_index', 'effective-goal-setting/00_index/', 'effective-goal-setting/0_preface', 'effective-goal-setting/0_preface/', 'effective-goal-setting/choosing-high-ev-goals', 'effective-goal-setting/choosing-high-ev-goals/', 'effective-goal-setting/choosing-high-ev-goals/00_index', 'effective-goal-setting/choosing-high-ev-goals/00_index/', 'effective-goal-setting/choosing-high-ev-goals/index', 'effective-goal-setting/choosing-high-ev-goals/index/', 'effective-goal-setting/index', 'effective-goal-setting/index/', 'effective-goal-setting/learning-to-fail/index', 'effective-goal-setting/learning-to-fail/index/'
);

-- viewId 42: effective-goal-setting/taking_asymmetric_bets
UPDATE page_views SET view_id = 42
WHERE view_id IS NULL AND page_path IN (
  '/effective-goal-setting/choosing-high-ev-goals/01_taleb', '/effective-goal-setting/choosing-high-ev-goals/01_taleb/', '/effective-goal-setting/choosing-high-ev-goals/taleb', '/effective-goal-setting/choosing-high-ev-goals/taleb/', '/effective-goal-setting/choosing-high-ev-goals/taleb_and_asymmetric_bets', '/effective-goal-setting/choosing-high-ev-goals/taleb_and_asymmetric_bets/', '/effective-goal-setting/taking_asymmetric_bets', '/effective-goal-setting/taking_asymmetric_bets/', 'effective-goal-setting/choosing-high-ev-goals/01_taleb', 'effective-goal-setting/choosing-high-ev-goals/01_taleb/', 'effective-goal-setting/choosing-high-ev-goals/taleb', 'effective-goal-setting/choosing-high-ev-goals/taleb/', 'effective-goal-setting/choosing-high-ev-goals/taleb_and_asymmetric_bets', 'effective-goal-setting/choosing-high-ev-goals/taleb_and_asymmetric_bets/', 'effective-goal-setting/taking_asymmetric_bets', 'effective-goal-setting/taking_asymmetric_bets/'
);

-- viewId 43: effective-goal-setting/the_framework
UPDATE page_views SET view_id = 43
WHERE view_id IS NULL AND page_path IN (
  '/effective-goal-setting/the_framework', '/effective-goal-setting/the_framework/', 'effective-goal-setting/the_framework', 'effective-goal-setting/the_framework/'
);

-- viewId 44: effective-goal-setting/the_psychology_of_failure
UPDATE page_views SET view_id = 44
WHERE view_id IS NULL AND page_path IN (
  '/effective-goal-setting/choosing-high-ev-goals/psychological_downside', '/effective-goal-setting/choosing-high-ev-goals/psychological_downside/', '/effective-goal-setting/choosing-high-ev-goals/the_floor', '/effective-goal-setting/choosing-high-ev-goals/the_floor/', '/effective-goal-setting/learning-to-fail/antifragility_is_exposure_therapy', '/effective-goal-setting/learning-to-fail/antifragility_is_exposure_therapy/', '/effective-goal-setting/learning-to-fail/becoming_a_professional_failer', '/effective-goal-setting/learning-to-fail/becoming_a_professional_failer/', '/effective-goal-setting/learning-to-fail/exposure_therapy_and_ocd', '/effective-goal-setting/learning-to-fail/exposure_therapy_and_ocd/', '/effective-goal-setting/learning-to-fail/fear_and_the_central_governor', '/effective-goal-setting/learning-to-fail/fear_and_the_central_governor/', '/effective-goal-setting/learning-to-fail/the_descriptive_prescriptive_gap', '/effective-goal-setting/learning-to-fail/the_descriptive_prescriptive_gap/', '/effective-goal-setting/the_psychology_of_failure', '/effective-goal-setting/the_psychology_of_failure/', 'effective-goal-setting/choosing-high-ev-goals/psychological_downside', 'effective-goal-setting/choosing-high-ev-goals/psychological_downside/', 'effective-goal-setting/choosing-high-ev-goals/the_floor', 'effective-goal-setting/choosing-high-ev-goals/the_floor/', 'effective-goal-setting/learning-to-fail/antifragility_is_exposure_therapy', 'effective-goal-setting/learning-to-fail/antifragility_is_exposure_therapy/', 'effective-goal-setting/learning-to-fail/becoming_a_professional_failer', 'effective-goal-setting/learning-to-fail/becoming_a_professional_failer/', 'effective-goal-setting/learning-to-fail/exposure_therapy_and_ocd', 'effective-goal-setting/learning-to-fail/exposure_therapy_and_ocd/', 'effective-goal-setting/learning-to-fail/fear_and_the_central_governor', 'effective-goal-setting/learning-to-fail/fear_and_the_central_governor/', 'effective-goal-setting/learning-to-fail/the_descriptive_prescriptive_gap', 'effective-goal-setting/learning-to-fail/the_descriptive_prescriptive_gap/', 'effective-goal-setting/the_psychology_of_failure', 'effective-goal-setting/the_psychology_of_failure/'
);

-- viewId 45: essays/a_farewell_to_arms_ernest_hemingway_1929
UPDATE page_views SET view_id = 45
WHERE view_id IS NULL AND page_path IN (
  '/books/3_a_farewell_to_arms', '/books/3_a_farewell_to_arms/', '/essays/a_farewell_to_arms_ernest_hemingway_1929', '/essays/a_farewell_to_arms_ernest_hemingway_1929/', '/essays/book_a_farewell_to_arms', '/essays/book_a_farewell_to_arms/', 'books/3_a_farewell_to_arms', 'books/3_a_farewell_to_arms/', 'essays/a_farewell_to_arms_ernest_hemingway_1929', 'essays/a_farewell_to_arms_ernest_hemingway_1929/', 'essays/book_a_farewell_to_arms', 'essays/book_a_farewell_to_arms/'
);

-- viewId 46: essays/a_time_of_gifts_patrick_leigh_fermor_1977
UPDATE page_views SET view_id = 46
WHERE view_id IS NULL AND page_path IN (
  '/Books/1_a_time_of_gifts', '/Books/1_a_time_of_gifts/', '/books/1_a_time_of_gifts', '/books/1_a_time_of_gifts/', '/books/a_time_of_gifts', '/books/a_time_of_gifts/', '/essays/a_time_of_gifts_patrick_leigh_fermor_1977', '/essays/a_time_of_gifts_patrick_leigh_fermor_1977/', '/posts/books/a_time_of_gifts', '/posts/books/a_time_of_gifts/', 'Books/1_a_time_of_gifts', 'Books/1_a_time_of_gifts/', 'books/1_a_time_of_gifts', 'books/1_a_time_of_gifts/', 'books/a_time_of_gifts', 'books/a_time_of_gifts/', 'essays/a_time_of_gifts_patrick_leigh_fermor_1977', 'essays/a_time_of_gifts_patrick_leigh_fermor_1977/', 'posts/books/a_time_of_gifts', 'posts/books/a_time_of_gifts/'
);

-- viewId 47: essays/andrei_rublev_and_the_problem_of_creation_under_uncertainty
UPDATE page_views SET view_id = 47
WHERE view_id IS NULL AND page_path IN (
  '/essays/andrei_rublev_and_the_problem_of_creation_under_uncertainty', '/essays/andrei_rublev_and_the_problem_of_creation_under_uncertainty/', '/essays/film_andrei_rublev', '/essays/film_andrei_rublev/', '/movies/1_andrei_rublev', '/movies/1_andrei_rublev/', 'essays/andrei_rublev_and_the_problem_of_creation_under_uncertainty', 'essays/andrei_rublev_and_the_problem_of_creation_under_uncertainty/', 'essays/film_andrei_rublev', 'essays/film_andrei_rublev/', 'movies/1_andrei_rublev', 'movies/1_andrei_rublev/'
);

-- viewId 48: essays/at_bagram_via_music_and_the_compression_ratio_of_sincerity
UPDATE page_views SET view_id = 48
WHERE view_id IS NULL AND page_path IN (
  '/essays/at_bagram_via_music_and_the_compression_ratio_of_sincerity', '/essays/at_bagram_via_music_and_the_compression_ratio_of_sincerity/', '/essays/kaskad_bagram', '/essays/kaskad_bagram/', 'essays/at_bagram_via_music_and_the_compression_ratio_of_sincerity', 'essays/at_bagram_via_music_and_the_compression_ratio_of_sincerity/', 'essays/kaskad_bagram', 'essays/kaskad_bagram/'
);

-- viewId 49: essays/bridging_the_transit_data_gap
UPDATE page_views SET view_id = 49
WHERE view_id IS NULL AND page_path IN (
  '/essays/bridging_the_transit_data_gap', '/essays/bridging_the_transit_data_gap/', '/essays/transit_ml_proposal', '/essays/transit_ml_proposal/', 'essays/bridging_the_transit_data_gap', 'essays/bridging_the_transit_data_gap/', 'essays/transit_ml_proposal', 'essays/transit_ml_proposal/'
);

-- viewId 50: essays/coordination_without_authority_zhang_zuolin_and_the_fengtian_clique
UPDATE page_views SET view_id = 50
WHERE view_id IS NULL AND page_path IN (
  '/essays/a_coalition_of_bandits', '/essays/a_coalition_of_bandits/', '/essays/coordination_without_authority_zhang_zuolin_and_the_fengtian_clique', '/essays/coordination_without_authority_zhang_zuolin_and_the_fengtian_clique/', '/essays/fengtian_economics', '/essays/fengtian_economics/', '/essays/the_bandit_who_became_a_state', '/essays/the_bandit_who_became_a_state/', '/history/fengtian_economics', '/history/fengtian_economics/', 'essays/a_coalition_of_bandits', 'essays/a_coalition_of_bandits/', 'essays/coordination_without_authority_zhang_zuolin_and_the_fengtian_clique', 'essays/coordination_without_authority_zhang_zuolin_and_the_fengtian_clique/', 'essays/fengtian_economics', 'essays/fengtian_economics/', 'essays/the_bandit_who_became_a_state', 'essays/the_bandit_who_became_a_state/', 'history/fengtian_economics', 'history/fengtian_economics/'
);

-- viewId 51: essays/discontinuous_utility_and_the_jutland_paradox
UPDATE page_views SET view_id = 51
WHERE view_id IS NULL AND page_path IN (
  '/essays/discontinuous_utility_and_the_jutland_paradox', '/essays/discontinuous_utility_and_the_jutland_paradox/', '/essays/dreadnought_economics', '/essays/dreadnought_economics/', '/history/dreadnought_economics', '/history/dreadnought_economics/', 'essays/discontinuous_utility_and_the_jutland_paradox', 'essays/discontinuous_utility_and_the_jutland_paradox/', 'essays/dreadnought_economics', 'essays/dreadnought_economics/', 'history/dreadnought_economics', 'history/dreadnought_economics/'
);

-- viewId 52: essays/fast_5k_pete_magill_2019
UPDATE page_views SET view_id = 52
WHERE view_id IS NULL AND page_path IN (
  '/books/5_fast_5k', '/books/5_fast_5k/', '/essays/book_fast_5k', '/essays/book_fast_5k/', '/essays/fast_5k_pete_magill_2019', '/essays/fast_5k_pete_magill_2019/', 'books/5_fast_5k', 'books/5_fast_5k/', 'essays/book_fast_5k', 'essays/book_fast_5k/', 'essays/fast_5k_pete_magill_2019', 'essays/fast_5k_pete_magill_2019/'
);

-- viewId 53: essays/in_the_heat_of_the_sun_memory_as_authorship
UPDATE page_views SET view_id = 53
WHERE view_id IS NULL AND page_path IN (
  '/essays/film_in_the_heat_of_the_sun', '/essays/film_in_the_heat_of_the_sun/', '/essays/in_the_heat_of_the_sun_memory_as_authorship', '/essays/in_the_heat_of_the_sun_memory_as_authorship/', '/movies/2_in_the_heat_of_the_sun', '/movies/2_in_the_heat_of_the_sun/', '/posts/movies/2_in_the_heat_of_the_sun', '/posts/movies/2_in_the_heat_of_the_sun/', 'essays/film_in_the_heat_of_the_sun', 'essays/film_in_the_heat_of_the_sun/', 'essays/in_the_heat_of_the_sun_memory_as_authorship', 'essays/in_the_heat_of_the_sun_memory_as_authorship/', 'movies/2_in_the_heat_of_the_sun', 'movies/2_in_the_heat_of_the_sun/', 'posts/movies/2_in_the_heat_of_the_sun', 'posts/movies/2_in_the_heat_of_the_sun/'
);

-- viewId 54: essays/index
UPDATE page_views SET view_id = 54
WHERE view_id IS NULL AND page_path IN (
  '/essays/index', '/essays/index/', 'essays/index', 'essays/index/'
);

-- viewId 55: essays/no_mans_land_and_the_comedy_of_observers
UPDATE page_views SET view_id = 55
WHERE view_id IS NULL AND page_path IN (
  '/essays/film_no_mans_land', '/essays/film_no_mans_land/', '/essays/no_mans_land_and_the_comedy_of_observers', '/essays/no_mans_land_and_the_comedy_of_observers/', '/movies/3_no_mans_land', '/movies/3_no_mans_land/', 'essays/film_no_mans_land', 'essays/film_no_mans_land/', 'essays/no_mans_land_and_the_comedy_of_observers', 'essays/no_mans_land_and_the_comedy_of_observers/', 'movies/3_no_mans_land', 'movies/3_no_mans_land/'
);

-- viewId 56: essays/reading_and_watchlist
UPDATE page_views SET view_id = 56
WHERE view_id IS NULL AND page_path IN (
  '/Books/reading_list', '/Books/reading_list/', '/books/0_reading_list', '/books/0_reading_list/', '/books/reading_list', '/books/reading_list/', '/essays/0_reading_and_watchlist', '/essays/0_reading_and_watchlist/', '/essays/reading_and_watchlist', '/essays/reading_and_watchlist/', '/movies/0_watchlist', '/movies/0_watchlist/', '/movies/watchlist', '/movies/watchlist/', '/readings/reading_list', '/readings/reading_list/', 'Books/reading_list', 'Books/reading_list/', 'books/0_reading_list', 'books/0_reading_list/', 'books/reading_list', 'books/reading_list/', 'essays/0_reading_and_watchlist', 'essays/0_reading_and_watchlist/', 'essays/reading_and_watchlist', 'essays/reading_and_watchlist/', 'movies/0_watchlist', 'movies/0_watchlist/', 'movies/watchlist', 'movies/watchlist/', 'readings/reading_list', 'readings/reading_list/'
);

-- viewId 57: essays/red_star_over_china_edgar_snow_1937
UPDATE page_views SET view_id = 57
WHERE view_id IS NULL AND page_path IN (
  '/books/4_red_star_over_china', '/books/4_red_star_over_china/', '/essays/book_red_star_over_china', '/essays/book_red_star_over_china/', '/essays/red_star_over_china_edgar_snow_1937', '/essays/red_star_over_china_edgar_snow_1937/', 'books/4_red_star_over_china', 'books/4_red_star_over_china/', 'essays/book_red_star_over_china', 'essays/book_red_star_over_china/', 'essays/red_star_over_china_edgar_snow_1937', 'essays/red_star_over_china_edgar_snow_1937/'
);

-- viewId 58: essays/shurik_gaidai_and_the_soviet_laugh
UPDATE page_views SET view_id = 58
WHERE view_id IS NULL AND page_path IN (
  '/essays/film_shurik_and_gaidai', '/essays/film_shurik_and_gaidai/', '/essays/shurik_gaidai_and_the_soviet_laugh', '/essays/shurik_gaidai_and_the_soviet_laugh/', 'essays/film_shurik_and_gaidai', 'essays/film_shurik_and_gaidai/', 'essays/shurik_gaidai_and_the_soviet_laugh', 'essays/shurik_gaidai_and_the_soviet_laugh/'
);

-- viewId 59: essays/the_feeling_you_cant_verify_napoleon_tukhachevsky_and_bonapartism
UPDATE page_views SET view_id = 59
WHERE view_id IS NULL AND page_path IN (
  '/essays/bonapartism', '/essays/bonapartism/', '/history/bonapartism', '/history/bonapartism/', 'essays/bonapartism', 'essays/bonapartism/', 'history/bonapartism', 'history/bonapartism/'
);

-- viewId 60: essays/the_goal_gradient
UPDATE page_views SET view_id = 60
WHERE view_id IS NULL AND page_path IN (
  '/essays/the_goal_gradient', '/essays/the_goal_gradient/', '/writing/the_goal_gradient', '/writing/the_goal_gradient/', 'essays/the_goal_gradient', 'essays/the_goal_gradient/', 'writing/the_goal_gradient', 'writing/the_goal_gradient/'
);

-- viewId 61: essays/the_translators_eye_language_acquisition_as_epistemology
UPDATE page_views SET view_id = 61
WHERE view_id IS NULL AND page_path IN (
  '/essays/henan', '/essays/henan/', 'essays/henan', 'essays/henan/'
);

-- viewId 62: firefox/clear-data-dialog/dead_code_cleanup
UPDATE page_views SET view_id = 62
WHERE view_id IS NULL AND page_path IN (
  '/firefox/clear-data-dialog/dead_code_cleanup', '/firefox/clear-data-dialog/dead_code_cleanup/', 'firefox/clear-data-dialog/dead_code_cleanup', 'firefox/clear-data-dialog/dead_code_cleanup/'
);

-- viewId 63: firefox/clear-data-dialog/index
UPDATE page_views SET view_id = 63
WHERE view_id IS NULL AND page_path IN (
  '/firefox/clear-data-dialog/index', '/firefox/clear-data-dialog/index/', 'firefox/clear-data-dialog/index', 'firefox/clear-data-dialog/index/'
);

-- viewId 64: firefox/clear-data-dialog/loading_indicator
UPDATE page_views SET view_id = 64
WHERE view_id IS NULL AND page_path IN (
  '/firefox/clear-data-dialog/loading_indicator', '/firefox/clear-data-dialog/loading_indicator/', 'firefox/clear-data-dialog/loading_indicator', 'firefox/clear-data-dialog/loading_indicator/'
);

-- viewId 65: firefox/clear-data-dialog/remove_old_dialog
UPDATE page_views SET view_id = 65
WHERE view_id IS NULL AND page_path IN (
  '/firefox/04_clear_data_dialog', '/firefox/04_clear_data_dialog/', '/firefox/clear-data-dialog/remove_old_dialog', '/firefox/clear-data-dialog/remove_old_dialog/', '/firefox/iv_clear_data_dialog_cleanup', '/firefox/iv_clear_data_dialog_cleanup/', 'firefox/04_clear_data_dialog', 'firefox/04_clear_data_dialog/', 'firefox/clear-data-dialog/remove_old_dialog', 'firefox/clear-data-dialog/remove_old_dialog/', 'firefox/iv_clear_data_dialog_cleanup', 'firefox/iv_clear_data_dialog_cleanup/'
);

-- viewId 66: firefox/community-engagement/index
UPDATE page_views SET view_id = 66
WHERE view_id IS NULL AND page_path IN (
  '/firefox/community-engagement/index', '/firefox/community-engagement/index/', 'firefox/community-engagement/index', 'firefox/community-engagement/index/'
);

-- viewId 67: firefox/community-engagement/mozilla_engineering_talks
UPDATE page_views SET view_id = 67
WHERE view_id IS NULL AND page_path IN (
  '/firefox/community-engagement/mozilla_engineering_talks', '/firefox/community-engagement/mozilla_engineering_talks/', '/firefox/mozilla_engineering_talks', '/firefox/mozilla_engineering_talks/', '/firefox/viii_mozilla_engineering_talks', '/firefox/viii_mozilla_engineering_talks/', 'firefox/community-engagement/mozilla_engineering_talks', 'firefox/community-engagement/mozilla_engineering_talks/', 'firefox/mozilla_engineering_talks', 'firefox/mozilla_engineering_talks/', 'firefox/viii_mozilla_engineering_talks', 'firefox/viii_mozilla_engineering_talks/'
);

-- viewId 68: firefox/copy-clean-link/clean_copy_pref
UPDATE page_views SET view_id = 68
WHERE view_id IS NULL AND page_path IN (
  '/firefox/copy-clean-link/clean_copy_pref', '/firefox/copy-clean-link/clean_copy_pref/', 'firefox/copy-clean-link/clean_copy_pref', 'firefox/copy-clean-link/clean_copy_pref/'
);

-- viewId 69: firefox/copy-clean-link/index
UPDATE page_views SET view_id = 69
WHERE view_id IS NULL AND page_path IN (
  '/firefox/copy-clean-link/index', '/firefox/copy-clean-link/index/', 'firefox/copy-clean-link/index', 'firefox/copy-clean-link/index/'
);

-- viewId 70: firefox/copy-clean-link/strip_audible_parameters
UPDATE page_views SET view_id = 70
WHERE view_id IS NULL AND page_path IN (
  '/firefox/copy-clean-link/strip_audible_parameters', '/firefox/copy-clean-link/strip_audible_parameters/', 'firefox/copy-clean-link/strip_audible_parameters', 'firefox/copy-clean-link/strip_audible_parameters/'
);

-- viewId 71: firefox/copy-clean-link/strip_gl_parameter
UPDATE page_views SET view_id = 71
WHERE view_id IS NULL AND page_path IN (
  '/firefox/copy-clean-link/strip_gl_parameter', '/firefox/copy-clean-link/strip_gl_parameter/', 'firefox/copy-clean-link/strip_gl_parameter', 'firefox/copy-clean-link/strip_gl_parameter/'
);

-- viewId 72: firefox/index
UPDATE page_views SET view_id = 72
WHERE view_id IS NULL AND page_path IN (
  '/firefox/0_preface', '/firefox/0_preface/', '/firefox/firefox_contributions', '/firefox/firefox_contributions/', '/firefox/index', '/firefox/index/', 'firefox/0_preface', 'firefox/0_preface/', 'firefox/firefox_contributions', 'firefox/firefox_contributions/', 'firefox/index', 'firefox/index/'
);

-- viewId 73: firefox/notifications-telemetry-pipeline/index
UPDATE page_views SET view_id = 73
WHERE view_id IS NULL AND page_path IN (
  '/firefox/notifications-telemetry-pipeline/index', '/firefox/notifications-telemetry-pipeline/index/', 'firefox/notifications-telemetry-pipeline/index', 'firefox/notifications-telemetry-pipeline/index/'
);

-- viewId 74: firefox/notifications-telemetry-pipeline/notification_permission_telemetry
UPDATE page_views SET view_id = 74
WHERE view_id IS NULL AND page_path IN (
  '/firefox/01_notification_telemetry', '/firefox/01_notification_telemetry/', '/firefox/02_telemetry_revocation', '/firefox/02_telemetry_revocation/', '/firefox/i_notification_permission_telemetry', '/firefox/i_notification_permission_telemetry/', '/firefox/ii_telemetry_revocation_events', '/firefox/ii_telemetry_revocation_events/', '/firefox/notifications-telemetry-pipeline/notification_permission_telemetry', '/firefox/notifications-telemetry-pipeline/notification_permission_telemetry/', 'firefox/01_notification_telemetry', 'firefox/01_notification_telemetry/', 'firefox/02_telemetry_revocation', 'firefox/02_telemetry_revocation/', 'firefox/i_notification_permission_telemetry', 'firefox/i_notification_permission_telemetry/', 'firefox/ii_telemetry_revocation_events', 'firefox/ii_telemetry_revocation_events/', 'firefox/notifications-telemetry-pipeline/notification_permission_telemetry', 'firefox/notifications-telemetry-pipeline/notification_permission_telemetry/'
);

-- viewId 75: firefox/privacy-alignment/android_etp_pipeline
UPDATE page_views SET view_id = 75
WHERE view_id IS NULL AND page_path IN (
  '/firefox/privacy-alignment/android-expansion/android_etp_pipeline', '/firefox/privacy-alignment/android-expansion/android_etp_pipeline/', '/firefox/privacy-alignment/android_etp_pipeline', '/firefox/privacy-alignment/android_etp_pipeline/', 'firefox/privacy-alignment/android-expansion/android_etp_pipeline', 'firefox/privacy-alignment/android-expansion/android_etp_pipeline/', 'firefox/privacy-alignment/android_etp_pipeline', 'firefox/privacy-alignment/android_etp_pipeline/'
);

-- viewId 76: firefox/privacy-alignment/index
UPDATE page_views SET view_id = 76
WHERE view_id IS NULL AND page_path IN (
  '/firefox/privacy-alignment/android-expansion/index', '/firefox/privacy-alignment/android-expansion/index/', '/firefox/privacy-alignment/desktop-extension/index', '/firefox/privacy-alignment/desktop-extension/index/', '/firefox/privacy-alignment/index', '/firefox/privacy-alignment/index/', 'firefox/privacy-alignment/android-expansion/index', 'firefox/privacy-alignment/android-expansion/index/', 'firefox/privacy-alignment/desktop-extension/index', 'firefox/privacy-alignment/desktop-extension/index/', 'firefox/privacy-alignment/index', 'firefox/privacy-alignment/index/'
);

-- viewId 77: firefox/privacy-alignment/private_browsing_cells
UPDATE page_views SET view_id = 77
WHERE view_id IS NULL AND page_path IN (
  '/firefox/privacy-alignment/desktop-extension/private_browsing_cells', '/firefox/privacy-alignment/desktop-extension/private_browsing_cells/', 'firefox/privacy-alignment/desktop-extension/private_browsing_cells', 'firefox/privacy-alignment/desktop-extension/private_browsing_cells/'
);

-- viewId 78: firefox/privacy-metrics-widget/index
UPDATE page_views SET view_id = 78
WHERE view_id IS NULL AND page_path IN (
  '/firefox/05_privacy_metrics_design', '/firefox/05_privacy_metrics_design/', '/firefox/privacy-metrics-widget/index', '/firefox/privacy-metrics-widget/index/', '/firefox/privacy-metrics-widget/v_privacy_metrics_design_and_data_foundation', '/firefox/privacy-metrics-widget/v_privacy_metrics_design_and_data_foundation/', '/firefox/v_privacy_metrics_design_and_data_foundation', '/firefox/v_privacy_metrics_design_and_data_foundation/', 'firefox/05_privacy_metrics_design', 'firefox/05_privacy_metrics_design/', 'firefox/privacy-metrics-widget/index', 'firefox/privacy-metrics-widget/index/', 'firefox/privacy-metrics-widget/v_privacy_metrics_design_and_data_foundation', 'firefox/privacy-metrics-widget/v_privacy_metrics_design_and_data_foundation/', 'firefox/v_privacy_metrics_design_and_data_foundation', 'firefox/v_privacy_metrics_design_and_data_foundation/'
);

-- viewId 79: firefox/privacy-metrics-widget/privacy_metrics_component
UPDATE page_views SET view_id = 79
WHERE view_id IS NULL AND page_path IN (
  '/firefox/07_privacy_metrics_ui', '/firefox/07_privacy_metrics_ui/', '/firefox/privacy-metrics-widget/privacy_metrics_component', '/firefox/privacy-metrics-widget/privacy_metrics_component/', '/firefox/vii_privacy_metrics_ui_and_testing', '/firefox/vii_privacy_metrics_ui_and_testing/', 'firefox/07_privacy_metrics_ui', 'firefox/07_privacy_metrics_ui/', 'firefox/privacy-metrics-widget/privacy_metrics_component', 'firefox/privacy-metrics-widget/privacy_metrics_component/', 'firefox/vii_privacy_metrics_ui_and_testing', 'firefox/vii_privacy_metrics_ui_and_testing/'
);

-- viewId 80: firefox/privacy-metrics-widget/privacy_metrics_service
UPDATE page_views SET view_id = 80
WHERE view_id IS NULL AND page_path IN (
  '/firefox/06_privacy_metrics_implementation', '/firefox/06_privacy_metrics_implementation/', '/firefox/privacy-metrics-widget/privacy_metrics_service', '/firefox/privacy-metrics-widget/privacy_metrics_service/', '/firefox/privacy-metrics-widget/vi_privacy_metrics_implementation', '/firefox/privacy-metrics-widget/vi_privacy_metrics_implementation/', '/firefox/vi_privacy_metrics_implementation', '/firefox/vi_privacy_metrics_implementation/', 'firefox/06_privacy_metrics_implementation', 'firefox/06_privacy_metrics_implementation/', 'firefox/privacy-metrics-widget/privacy_metrics_service', 'firefox/privacy-metrics-widget/privacy_metrics_service/', 'firefox/privacy-metrics-widget/vi_privacy_metrics_implementation', 'firefox/privacy-metrics-widget/vi_privacy_metrics_implementation/', 'firefox/vi_privacy_metrics_implementation', 'firefox/vi_privacy_metrics_implementation/'
);

-- viewId 81: firefox/smartblock/embed_link_preservation
UPDATE page_views SET view_id = 81
WHERE view_id IS NULL AND page_path IN (
  '/firefox/03_smartblock_links', '/firefox/03_smartblock_links/', '/firefox/iii_smartblock_link_preservation', '/firefox/iii_smartblock_link_preservation/', '/firefox/smartblock/embed_link_preservation', '/firefox/smartblock/embed_link_preservation/', 'firefox/03_smartblock_links', 'firefox/03_smartblock_links/', 'firefox/iii_smartblock_link_preservation', 'firefox/iii_smartblock_link_preservation/', 'firefox/smartblock/embed_link_preservation', 'firefox/smartblock/embed_link_preservation/'
);

-- viewId 82: firefox/smartblock/facebook_post_shim
UPDATE page_views SET view_id = 82
WHERE view_id IS NULL AND page_path IN (
  '/firefox/smartblock/facebook_post_shim', '/firefox/smartblock/facebook_post_shim/', 'firefox/smartblock/facebook_post_shim', 'firefox/smartblock/facebook_post_shim/'
);

-- viewId 83: firefox/smartblock/index
UPDATE page_views SET view_id = 83
WHERE view_id IS NULL AND page_path IN (
  '/firefox/smartblock/index', '/firefox/smartblock/index/', 'firefox/smartblock/index', 'firefox/smartblock/index/'
);

-- viewId 84: frontend/0_vanilla_js_crash_course
UPDATE page_views SET view_id = 84
WHERE view_id IS NULL AND page_path IN (
  '/frontend/00_vanilla_js_crash_course', '/frontend/00_vanilla_js_crash_course/', '/frontend/0_vanilla_js_crash_course', '/frontend/0_vanilla_js_crash_course/', '/frontend/vanilla_js_crash_course', '/frontend/vanilla_js_crash_course/', 'frontend/00_vanilla_js_crash_course', 'frontend/00_vanilla_js_crash_course/', 'frontend/0_vanilla_js_crash_course', 'frontend/0_vanilla_js_crash_course/', 'frontend/vanilla_js_crash_course', 'frontend/vanilla_js_crash_course/'
);

-- viewId 85: frontend/1_react_quick_start
UPDATE page_views SET view_id = 85
WHERE view_id IS NULL AND page_path IN (
  '/frontend/01_react_quick_start', '/frontend/01_react_quick_start/', '/frontend/1_react_quick_start', '/frontend/1_react_quick_start/', 'frontend/01_react_quick_start', 'frontend/01_react_quick_start/', 'frontend/1_react_quick_start', 'frontend/1_react_quick_start/'
);

-- viewId 86: frontend/2_react_practice_components
UPDATE page_views SET view_id = 86
WHERE view_id IS NULL AND page_path IN (
  '/frontend/02_react_practice_components', '/frontend/02_react_practice_components/', '/frontend/react-practice', '/frontend/react-practice/', 'frontend/02_react_practice_components', 'frontend/02_react_practice_components/', 'frontend/react-practice', 'frontend/react-practice/'
);

-- viewId 87: frontend/3_react_intermediate
UPDATE page_views SET view_id = 87
WHERE view_id IS NULL AND page_path IN (
  '/frontend/03_react_intermediate', '/frontend/03_react_intermediate/', '/frontend/3_react_intermediate', '/frontend/3_react_intermediate/', '/frontend/react_intermediate', '/frontend/react_intermediate/', 'frontend/03_react_intermediate', 'frontend/03_react_intermediate/', 'frontend/3_react_intermediate', 'frontend/3_react_intermediate/', 'frontend/react_intermediate', 'frontend/react_intermediate/'
);

-- viewId 88: frontend/4_react_advanced_concepts
UPDATE page_views SET view_id = 88
WHERE view_id IS NULL AND page_path IN (
  '/frontend/04_react_advanced', '/frontend/04_react_advanced/', '/frontend/4_react_advanced_concepts', '/frontend/4_react_advanced_concepts/', 'frontend/04_react_advanced', 'frontend/04_react_advanced/', 'frontend/4_react_advanced_concepts', 'frontend/4_react_advanced_concepts/'
);

-- viewId 89: frontend/5_intermediate_practice_components
UPDATE page_views SET view_id = 89
WHERE view_id IS NULL AND page_path IN (
  '/frontend/05_intermediate_practice_components', '/frontend/05_intermediate_practice_components/', '/frontend/5_intermediate_practice_components', '/frontend/5_intermediate_practice_components/', 'frontend/05_intermediate_practice_components', 'frontend/05_intermediate_practice_components/', 'frontend/5_intermediate_practice_components', 'frontend/5_intermediate_practice_components/'
);

-- viewId 90: frontend/6_interview_simulation_components
UPDATE page_views SET view_id = 90
WHERE view_id IS NULL AND page_path IN (
  '/frontend/06_interview_sim_components', '/frontend/06_interview_sim_components/', '/frontend/6_interview_simulation_components', '/frontend/6_interview_simulation_components/', '/frontend/interview_sim_components', '/frontend/interview_sim_components/', 'frontend/06_interview_sim_components', 'frontend/06_interview_sim_components/', 'frontend/6_interview_simulation_components', 'frontend/6_interview_simulation_components/', 'frontend/interview_sim_components', 'frontend/interview_sim_components/'
);

-- viewId 91: frontend/7_data_wrangling_with_javascript
UPDATE page_views SET view_id = 91
WHERE view_id IS NULL AND page_path IN (
  '/frontend/07_data_wrangling', '/frontend/07_data_wrangling/', '/frontend/7_data_wrangling_with_javascript', '/frontend/7_data_wrangling_with_javascript/', 'frontend/07_data_wrangling', 'frontend/07_data_wrangling/', 'frontend/7_data_wrangling_with_javascript', 'frontend/7_data_wrangling_with_javascript/'
);

-- viewId 92: frontend/index
UPDATE page_views SET view_id = 92
WHERE view_id IS NULL AND page_path IN (
  '/frontend/00_index', '/frontend/00_index/', 'frontend/00_index', 'frontend/00_index/'
);

-- viewId 93: index
UPDATE page_views SET view_id = 93
WHERE view_id IS NULL AND page_path IN (
  '/index', '/index/', 'index', 'index/'
);

-- viewId 94: linear-algebra/10_eigenvalues_and_eigenvectors
UPDATE page_views SET view_id = 94
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/10_eigenvalues_and_eigenvectors', '/linear-algebra/10_eigenvalues_and_eigenvectors/', 'linear-algebra/10_eigenvalues_and_eigenvectors', 'linear-algebra/10_eigenvalues_and_eigenvectors/'
);

-- viewId 95: linear-algebra/11_diagonalization_and_similarity
UPDATE page_views SET view_id = 95
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/11_diagonalization_and_similarity', '/linear-algebra/11_diagonalization_and_similarity/', 'linear-algebra/11_diagonalization_and_similarity', 'linear-algebra/11_diagonalization_and_similarity/'
);

-- viewId 96: linear-algebra/12_orthogonal_diagonalization_and_the_spectral_theorem
UPDATE page_views SET view_id = 96
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/12_orthogonal_diagonalization', '/linear-algebra/12_orthogonal_diagonalization/', 'linear-algebra/12_orthogonal_diagonalization', 'linear-algebra/12_orthogonal_diagonalization/'
);

-- viewId 97: linear-algebra/13_singular_value_decomposition
UPDATE page_views SET view_id = 97
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/13_singular_value_decomposition', '/linear-algebra/13_singular_value_decomposition/', 'linear-algebra/13_singular_value_decomposition', 'linear-algebra/13_singular_value_decomposition/'
);

-- viewId 98: linear-algebra/14_portfolio_optimization
UPDATE page_views SET view_id = 98
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/14_portfolio_optimization', '/linear-algebra/14_portfolio_optimization/', 'linear-algebra/14_portfolio_optimization', 'linear-algebra/14_portfolio_optimization/'
);

-- viewId 99: linear-algebra/15_pca_in_finance
UPDATE page_views SET view_id = 99
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/15_pca_in_finance', '/linear-algebra/15_pca_in_finance/', 'linear-algebra/15_pca_in_finance', 'linear-algebra/15_pca_in_finance/'
);

-- viewId 100: linear-algebra/16_covariance_estimation_and_regularization
UPDATE page_views SET view_id = 100
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/16_covariance_estimation', '/linear-algebra/16_covariance_estimation/', 'linear-algebra/16_covariance_estimation', 'linear-algebra/16_covariance_estimation/'
);

-- viewId 101: linear-algebra/1_re_imagining_matrices
UPDATE page_views SET view_id = 101
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/01_reimagining_matrices', '/linear-algebra/01_reimagining_matrices/', 'linear-algebra/01_reimagining_matrices', 'linear-algebra/01_reimagining_matrices/'
);

-- viewId 102: linear-algebra/2_solving_linear_systems
UPDATE page_views SET view_id = 102
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/02_solving_linear_systems', '/linear-algebra/02_solving_linear_systems/', '/linear-algebra/2_solving_linear_systems', '/linear-algebra/2_solving_linear_systems/', 'linear-algebra/02_solving_linear_systems', 'linear-algebra/02_solving_linear_systems/', 'linear-algebra/2_solving_linear_systems', 'linear-algebra/2_solving_linear_systems/'
);

-- viewId 103: linear-algebra/3_vectors_in_euclidian_space
UPDATE page_views SET view_id = 103
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/03_vectors_in_euclidean_space', '/linear-algebra/03_vectors_in_euclidean_space/', 'linear-algebra/03_vectors_in_euclidean_space', 'linear-algebra/03_vectors_in_euclidean_space/'
);

-- viewId 104: linear-algebra/4_matrix_operations
UPDATE page_views SET view_id = 104
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/04_matrix_operations', '/linear-algebra/04_matrix_operations/', 'linear-algebra/04_matrix_operations', 'linear-algebra/04_matrix_operations/'
);

-- viewId 105: linear-algebra/5_matrix_transformations_as_functions
UPDATE page_views SET view_id = 105
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/05_matrix_transformations', '/linear-algebra/05_matrix_transformations/', 'linear-algebra/05_matrix_transformations', 'linear-algebra/05_matrix_transformations/'
);

-- viewId 106: linear-algebra/6_subspaces
UPDATE page_views SET view_id = 106
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/06_subspaces', '/linear-algebra/06_subspaces/', 'linear-algebra/06_subspaces', 'linear-algebra/06_subspaces/'
);

-- viewId 107: linear-algebra/7_kernel_and_image
UPDATE page_views SET view_id = 107
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/07_kernel_and_image', '/linear-algebra/07_kernel_and_image/', 'linear-algebra/07_kernel_and_image', 'linear-algebra/07_kernel_and_image/'
);

-- viewId 108: linear-algebra/8_orthogonality_and_projections
UPDATE page_views SET view_id = 108
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/08_orthogonality_and_projections', '/linear-algebra/08_orthogonality_and_projections/', 'linear-algebra/08_orthogonality_and_projections', 'linear-algebra/08_orthogonality_and_projections/'
);

-- viewId 109: linear-algebra/9_the_determinant
UPDATE page_views SET view_id = 109
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/09_determinants', '/linear-algebra/09_determinants/', 'linear-algebra/09_determinants', 'linear-algebra/09_determinants/'
);

-- viewId 110: linear-algebra/index
UPDATE page_views SET view_id = 110
WHERE view_id IS NULL AND page_path IN (
  '/linear-algebra/0_preface', '/linear-algebra/0_preface/', '/linear-algebra/index', '/linear-algebra/index/', 'linear-algebra/0_preface', 'linear-algebra/0_preface/', 'linear-algebra/index', 'linear-algebra/index/'
);

-- viewId 111: machine-learning/01-k-nearest-neighbors/experiment_mnist_digit_classification
UPDATE page_views SET view_id = 111
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/01-k-nearest-neighbors/02_experiment_mnist', '/machine-learning/01-k-nearest-neighbors/02_experiment_mnist/', '/machine-learning/01-k-nearest-neighbors/experiment_mnist', '/machine-learning/01-k-nearest-neighbors/experiment_mnist/', '/machine-learning/01-k-nearest-neighbors/experiment_mnist_digit_classification', '/machine-learning/01-k-nearest-neighbors/experiment_mnist_digit_classification/', '/machine-learning/1-k-nearest-neighbors/02_lab', '/machine-learning/1-k-nearest-neighbors/02_lab/', 'machine-learning/01-k-nearest-neighbors/02_experiment_mnist', 'machine-learning/01-k-nearest-neighbors/02_experiment_mnist/', 'machine-learning/01-k-nearest-neighbors/experiment_mnist', 'machine-learning/01-k-nearest-neighbors/experiment_mnist/', 'machine-learning/01-k-nearest-neighbors/experiment_mnist_digit_classification', 'machine-learning/01-k-nearest-neighbors/experiment_mnist_digit_classification/', 'machine-learning/1-k-nearest-neighbors/02_lab', 'machine-learning/1-k-nearest-neighbors/02_lab/'
);

-- viewId 112: machine-learning/01-k-nearest-neighbors/index
UPDATE page_views SET view_id = 112
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/01-k-nearest-neighbors/00_index', '/machine-learning/01-k-nearest-neighbors/00_index/', 'machine-learning/01-k-nearest-neighbors/00_index', 'machine-learning/01-k-nearest-neighbors/00_index/'
);

-- viewId 113: machine-learning/01-k-nearest-neighbors/k_nearest_neighbors
UPDATE page_views SET view_id = 113
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/01-k-nearest-neighbors/01_knn', '/machine-learning/01-k-nearest-neighbors/01_knn/', '/machine-learning/01-k-nearest-neighbors/knn', '/machine-learning/01-k-nearest-neighbors/knn/', '/machine-learning/01_knn', '/machine-learning/01_knn/', '/machine-learning/1-k-nearest-neighbors/01_knn', '/machine-learning/1-k-nearest-neighbors/01_knn/', 'machine-learning/01-k-nearest-neighbors/01_knn', 'machine-learning/01-k-nearest-neighbors/01_knn/', 'machine-learning/01-k-nearest-neighbors/knn', 'machine-learning/01-k-nearest-neighbors/knn/', 'machine-learning/01_knn', 'machine-learning/01_knn/', 'machine-learning/1-k-nearest-neighbors/01_knn', 'machine-learning/1-k-nearest-neighbors/01_knn/'
);

-- viewId 114: machine-learning/02-decision-trees/decision_trees
UPDATE page_views SET view_id = 114
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/02-decision-trees/01_decision_trees', '/machine-learning/02-decision-trees/01_decision_trees/', '/machine-learning/02-decision-trees/decision_trees', '/machine-learning/02-decision-trees/decision_trees/', '/machine-learning/02_decision_trees', '/machine-learning/02_decision_trees/', '/machine-learning/2-decision-trees/01_decision_trees', '/machine-learning/2-decision-trees/01_decision_trees/', 'machine-learning/02-decision-trees/01_decision_trees', 'machine-learning/02-decision-trees/01_decision_trees/', 'machine-learning/02-decision-trees/decision_trees', 'machine-learning/02-decision-trees/decision_trees/', 'machine-learning/02_decision_trees', 'machine-learning/02_decision_trees/', 'machine-learning/2-decision-trees/01_decision_trees', 'machine-learning/2-decision-trees/01_decision_trees/'
);

-- viewId 115: machine-learning/02-decision-trees/experiment_heart_disease_prediction
UPDATE page_views SET view_id = 115
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/02-decision-trees/02_experiment_heart_disease', '/machine-learning/02-decision-trees/02_experiment_heart_disease/', '/machine-learning/02-decision-trees/experiment_heart_disease', '/machine-learning/02-decision-trees/experiment_heart_disease/', '/machine-learning/02-decision-trees/experiment_heart_disease_prediction', '/machine-learning/02-decision-trees/experiment_heart_disease_prediction/', '/machine-learning/2-decision-trees/02_lab', '/machine-learning/2-decision-trees/02_lab/', 'machine-learning/02-decision-trees/02_experiment_heart_disease', 'machine-learning/02-decision-trees/02_experiment_heart_disease/', 'machine-learning/02-decision-trees/experiment_heart_disease', 'machine-learning/02-decision-trees/experiment_heart_disease/', 'machine-learning/02-decision-trees/experiment_heart_disease_prediction', 'machine-learning/02-decision-trees/experiment_heart_disease_prediction/', 'machine-learning/2-decision-trees/02_lab', 'machine-learning/2-decision-trees/02_lab/'
);

-- viewId 116: machine-learning/03-linear-regression/experiment_gradient_descent
UPDATE page_views SET view_id = 116
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/03-linear-regression/03_experiment_gradient_descent', '/machine-learning/03-linear-regression/03_experiment_gradient_descent/', '/machine-learning/03_linear_regression/03_lab', '/machine-learning/03_linear_regression/03_lab/', '/machine-learning/3-linear-regression/03_lab', '/machine-learning/3-linear-regression/03_lab/', 'machine-learning/03-linear-regression/03_experiment_gradient_descent', 'machine-learning/03-linear-regression/03_experiment_gradient_descent/', 'machine-learning/03_linear_regression/03_lab', 'machine-learning/03_linear_regression/03_lab/', 'machine-learning/3-linear-regression/03_lab', 'machine-learning/3-linear-regression/03_lab/'
);

-- viewId 117: machine-learning/03-linear-regression/gradient_descent
UPDATE page_views SET view_id = 117
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/03-linear-regression/02_gradient_descent', '/machine-learning/03-linear-regression/02_gradient_descent/', '/machine-learning/03_linear_regression/02_gradient_descent', '/machine-learning/03_linear_regression/02_gradient_descent/', '/machine-learning/3-linear-regression/02_gradient_descent', '/machine-learning/3-linear-regression/02_gradient_descent/', 'machine-learning/03-linear-regression/02_gradient_descent', 'machine-learning/03-linear-regression/02_gradient_descent/', 'machine-learning/03_linear_regression/02_gradient_descent', 'machine-learning/03_linear_regression/02_gradient_descent/', 'machine-learning/3-linear-regression/02_gradient_descent', 'machine-learning/3-linear-regression/02_gradient_descent/'
);

-- viewId 118: machine-learning/03-linear-regression/index
UPDATE page_views SET view_id = 118
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/03-linear-regression/00_index', '/machine-learning/03-linear-regression/00_index/', 'machine-learning/03-linear-regression/00_index', 'machine-learning/03-linear-regression/00_index/'
);

-- viewId 119: machine-learning/03-linear-regression/linear_regression
UPDATE page_views SET view_id = 119
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/03-linear-regression/01_linear_regression', '/machine-learning/03-linear-regression/01_linear_regression/', '/machine-learning/03-linear-regression/linear_regression', '/machine-learning/03-linear-regression/linear_regression/', '/machine-learning/03_linear_regression', '/machine-learning/03_linear_regression/', '/machine-learning/03_linear_regression/01_linear_regression', '/machine-learning/03_linear_regression/01_linear_regression/', '/machine-learning/3-linear-regression/01_linear_regression', '/machine-learning/3-linear-regression/01_linear_regression/', 'machine-learning/03-linear-regression/01_linear_regression', 'machine-learning/03-linear-regression/01_linear_regression/', 'machine-learning/03-linear-regression/linear_regression', 'machine-learning/03-linear-regression/linear_regression/', 'machine-learning/03_linear_regression', 'machine-learning/03_linear_regression/', 'machine-learning/03_linear_regression/01_linear_regression', 'machine-learning/03_linear_regression/01_linear_regression/', 'machine-learning/3-linear-regression/01_linear_regression', 'machine-learning/3-linear-regression/01_linear_regression/'
);

-- viewId 120: machine-learning/03-linear-regression/practice_problems
UPDATE page_views SET view_id = 120
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/03-linear-regression/04_practice', '/machine-learning/03-linear-regression/04_practice/', '/machine-learning/03-linear-regression/practice_problems', '/machine-learning/03-linear-regression/practice_problems/', '/machine-learning/3-linear-regression/04_practice', '/machine-learning/3-linear-regression/04_practice/', 'machine-learning/03-linear-regression/04_practice', 'machine-learning/03-linear-regression/04_practice/', 'machine-learning/03-linear-regression/practice_problems', 'machine-learning/03-linear-regression/practice_problems/', 'machine-learning/3-linear-regression/04_practice', 'machine-learning/3-linear-regression/04_practice/'
);

-- viewId 121: machine-learning/04-logistic-regression-and-regularization/logistic_regression_and_regularization
UPDATE page_views SET view_id = 121
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/04-logistic-regression-and-regularization/04_linear_classification', '/machine-learning/04-logistic-regression-and-regularization/04_linear_classification/', '/machine-learning/04_linear_classification', '/machine-learning/04_linear_classification/', '/machine-learning/4-linear-classification/04_linear_classification', '/machine-learning/4-linear-classification/04_linear_classification/', 'machine-learning/04-logistic-regression-and-regularization/04_linear_classification', 'machine-learning/04-logistic-regression-and-regularization/04_linear_classification/', 'machine-learning/04_linear_classification', 'machine-learning/04_linear_classification/', 'machine-learning/4-linear-classification/04_linear_classification', 'machine-learning/4-linear-classification/04_linear_classification/'
);

-- viewId 122: machine-learning/05-neural-networks/neural_networks
UPDATE page_views SET view_id = 122
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/05-neural-networks/01_neural_networks', '/machine-learning/05-neural-networks/01_neural_networks/', '/machine-learning/05_neural_networks', '/machine-learning/05_neural_networks/', 'machine-learning/05-neural-networks/01_neural_networks', 'machine-learning/05-neural-networks/01_neural_networks/', 'machine-learning/05_neural_networks', 'machine-learning/05_neural_networks/'
);

-- viewId 123: machine-learning/06-backpropagation/backpropagation
UPDATE page_views SET view_id = 123
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/06-backpropagation/01_training_neural_networks', '/machine-learning/06-backpropagation/01_training_neural_networks/', '/machine-learning/06_training_neural_networks', '/machine-learning/06_training_neural_networks/', 'machine-learning/06-backpropagation/01_training_neural_networks', 'machine-learning/06-backpropagation/01_training_neural_networks/', 'machine-learning/06_training_neural_networks', 'machine-learning/06_training_neural_networks/'
);

-- viewId 124: machine-learning/07-bias-variance-tradeoff-and-bagging/bias_variance_tradeoff_and_bagging
UPDATE page_views SET view_id = 124
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/07-bias-variance-tradeoff-and-bagging/01_bias_variance', '/machine-learning/07-bias-variance-tradeoff-and-bagging/01_bias_variance/', 'machine-learning/07-bias-variance-tradeoff-and-bagging/01_bias_variance', 'machine-learning/07-bias-variance-tradeoff-and-bagging/01_bias_variance/'
);

-- viewId 125: machine-learning/08-naive-bayes/naive_bayes
UPDATE page_views SET view_id = 125
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/08-naive-bayes/01_naive_bayes', '/machine-learning/08-naive-bayes/01_naive_bayes/', 'machine-learning/08-naive-bayes/01_naive_bayes', 'machine-learning/08-naive-bayes/01_naive_bayes/'
);

-- viewId 126: machine-learning/09-gaussian-discriminant-analysis/gaussian_discriminant_analysis
UPDATE page_views SET view_id = 126
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/09-gaussian-discriminant-analysis/01_gda', '/machine-learning/09-gaussian-discriminant-analysis/01_gda/', 'machine-learning/09-gaussian-discriminant-analysis/01_gda', 'machine-learning/09-gaussian-discriminant-analysis/01_gda/'
);

-- viewId 127: machine-learning/index
UPDATE page_views SET view_id = 127
WHERE view_id IS NULL AND page_path IN (
  '/machine-learning/00_index', '/machine-learning/00_index/', '/machine-learning/0_preface', '/machine-learning/0_preface/', '/machine-learning/index', '/machine-learning/index/', '/machine-learning/preface', '/machine-learning/preface/', 'machine-learning/00_index', 'machine-learning/00_index/', 'machine-learning/0_preface', 'machine-learning/0_preface/', 'machine-learning/index', 'machine-learning/index/', 'machine-learning/preface', 'machine-learning/preface/'
);

-- viewId 128: markus/index
UPDATE page_views SET view_id = 128
WHERE view_id IS NULL AND page_path IN (
  '/markus/00_index', '/markus/00_index/', '/markus/index', '/markus/index/', 'markus/00_index', 'markus/00_index/', 'markus/index', 'markus/index/'
);

-- viewId 129: markus/markus_framework_maintenance
UPDATE page_views SET view_id = 129
WHERE view_id IS NULL AND page_path IN (
  '/department-of-computer-science/2-markus/02_framework', '/department-of-computer-science/2-markus/02_framework/', '/markus/02_framework', '/markus/02_framework/', '/markus/markus_framework_maintenance', '/markus/markus_framework_maintenance/', 'department-of-computer-science/2-markus/02_framework', 'department-of-computer-science/2-markus/02_framework/', 'markus/02_framework', 'markus/02_framework/', 'markus/markus_framework_maintenance', 'markus/markus_framework_maintenance/'
);

-- viewId 130: markus/markus_model_architecture
UPDATE page_views SET view_id = 130
WHERE view_id IS NULL AND page_path IN (
  '/department-of-computer-science/2-markus/04_models', '/department-of-computer-science/2-markus/04_models/', '/markus/04_models', '/markus/04_models/', '/markus/markus_model_architecture', '/markus/markus_model_architecture/', '/markus/models', '/markus/models/', 'department-of-computer-science/2-markus/04_models', 'department-of-computer-science/2-markus/04_models/', 'markus/04_models', 'markus/04_models/', 'markus/markus_model_architecture', 'markus/markus_model_architecture/', 'markus/models', 'markus/models/'
);

-- viewId 131: markus/markus_performance
UPDATE page_views SET view_id = 131
WHERE view_id IS NULL AND page_path IN (
  '/department-of-computer-science/2-markus/03_performance', '/department-of-computer-science/2-markus/03_performance/', '/markus/03_performance', '/markus/03_performance/', '/markus/markus_performance', '/markus/markus_performance/', 'department-of-computer-science/2-markus/03_performance', 'department-of-computer-science/2-markus/03_performance/', 'markus/03_performance', 'markus/03_performance/', 'markus/markus_performance', 'markus/markus_performance/'
);

-- viewId 132: markus/markus_scheduled_visibility_backend
UPDATE page_views SET view_id = 132
WHERE view_id IS NULL AND page_path IN (
  '/department-of-computer-science/2-markus/05_visibility_backend', '/department-of-computer-science/2-markus/05_visibility_backend/', 'department-of-computer-science/2-markus/05_visibility_backend', 'department-of-computer-science/2-markus/05_visibility_backend/'
);

-- viewId 133: markus/markus_scheduled_visibility_frontend
UPDATE page_views SET view_id = 133
WHERE view_id IS NULL AND page_path IN (
  '/department-of-computer-science/2-markus/06_visibility_frontend', '/department-of-computer-science/2-markus/06_visibility_frontend/', '/markus/markus_scheduled_visibility_frontend', '/markus/markus_scheduled_visibility_frontend/', 'department-of-computer-science/2-markus/06_visibility_frontend', 'department-of-computer-science/2-markus/06_visibility_frontend/', 'markus/markus_scheduled_visibility_frontend', 'markus/markus_scheduled_visibility_frontend/'
);

-- viewId 134: markus/markus_testing
UPDATE page_views SET view_id = 134
WHERE view_id IS NULL AND page_path IN (
  '/department-of-computer-science/2-markus/01_testing', '/department-of-computer-science/2-markus/01_testing/', '/markus/01_testing', '/markus/01_testing/', '/markus/markus_testing', '/markus/markus_testing/', 'department-of-computer-science/2-markus/01_testing', 'department-of-computer-science/2-markus/01_testing/', 'markus/01_testing', 'markus/01_testing/', 'markus/markus_testing', 'markus/markus_testing/'
);

-- viewId 135: markus/markus_touch_annotations
UPDATE page_views SET view_id = 135
WHERE view_id IS NULL AND page_path IN (
  '/department-of-computer-science/2-markus/07_touch_annotations', '/department-of-computer-science/2-markus/07_touch_annotations/', '/markus/markus_touch_annotations', '/markus/markus_touch_annotations/', 'department-of-computer-science/2-markus/07_touch_annotations', 'department-of-computer-science/2-markus/07_touch_annotations/', 'markus/markus_touch_annotations', 'markus/markus_touch_annotations/'
);

-- viewId 136: multivariable-calculus/1_parametric_equations_polar_coordinates
UPDATE page_views SET view_id = 136
WHERE view_id IS NULL AND page_path IN (
  '/calculus/01_parametric_polar', '/calculus/01_parametric_polar/', '/multivariable-calculus/01_parametric_polar', '/multivariable-calculus/01_parametric_polar/', '/multivariable-calculus/1_parametric_equations_polar_coordinates', '/multivariable-calculus/1_parametric_equations_polar_coordinates/', 'calculus/01_parametric_polar', 'calculus/01_parametric_polar/', 'multivariable-calculus/01_parametric_polar', 'multivariable-calculus/01_parametric_polar/', 'multivariable-calculus/1_parametric_equations_polar_coordinates', 'multivariable-calculus/1_parametric_equations_polar_coordinates/'
);

-- viewId 137: multivariable-calculus/2_vectors
UPDATE page_views SET view_id = 137
WHERE view_id IS NULL AND page_path IN (
  '/calculus/02_vectors', '/calculus/02_vectors/', '/multivariable-calculus/02_vectors', '/multivariable-calculus/02_vectors/', 'calculus/02_vectors', 'calculus/02_vectors/', 'multivariable-calculus/02_vectors', 'multivariable-calculus/02_vectors/'
);

-- viewId 138: multivariable-calculus/3_vector_functions_and_space_curves
UPDATE page_views SET view_id = 138
WHERE view_id IS NULL AND page_path IN (
  '/calculus/03_vector_functions_space_curves', '/calculus/03_vector_functions_space_curves/', '/multivariable-calculus/03_vector_functions_space_curves', '/multivariable-calculus/03_vector_functions_space_curves/', 'calculus/03_vector_functions_space_curves', 'calculus/03_vector_functions_space_curves/', 'multivariable-calculus/03_vector_functions_space_curves', 'multivariable-calculus/03_vector_functions_space_curves/'
);

-- viewId 139: multivariable-calculus/4_differential_calculus_of_several_variables
UPDATE page_views SET view_id = 139
WHERE view_id IS NULL AND page_path IN (
  '/calculus/04_multivariable_differential', '/calculus/04_multivariable_differential/', '/multivariable-calculus/04_multivariable_differential', '/multivariable-calculus/04_multivariable_differential/', 'calculus/04_multivariable_differential', 'calculus/04_multivariable_differential/', 'multivariable-calculus/04_multivariable_differential', 'multivariable-calculus/04_multivariable_differential/'
);

-- viewId 140: multivariable-calculus/5_integral_calculus_of_several_variables
UPDATE page_views SET view_id = 140
WHERE view_id IS NULL AND page_path IN (
  '/calculus/05_multivariable_integral', '/calculus/05_multivariable_integral/', '/multivariable-calculus/05_multivariable_integral', '/multivariable-calculus/05_multivariable_integral/', 'calculus/05_multivariable_integral', 'calculus/05_multivariable_integral/', 'multivariable-calculus/05_multivariable_integral', 'multivariable-calculus/05_multivariable_integral/'
);

-- viewId 141: multivariable-calculus/6_line_integrals
UPDATE page_views SET view_id = 141
WHERE view_id IS NULL AND page_path IN (
  '/calculus/06_line_integrals', '/calculus/06_line_integrals/', '/multivariable-calculus/06_line_integrals', '/multivariable-calculus/06_line_integrals/', 'calculus/06_line_integrals', 'calculus/06_line_integrals/', 'multivariable-calculus/06_line_integrals', 'multivariable-calculus/06_line_integrals/'
);

-- viewId 142: multivariable-calculus/7_surface_integrals
UPDATE page_views SET view_id = 142
WHERE view_id IS NULL AND page_path IN (
  '/multivariable-calculus/07_surface_integrals', '/multivariable-calculus/07_surface_integrals/', 'multivariable-calculus/07_surface_integrals', 'multivariable-calculus/07_surface_integrals/'
);

-- viewId 143: multivariable-calculus/8_vector_calculus_theorems
UPDATE page_views SET view_id = 143
WHERE view_id IS NULL AND page_path IN (
  '/multivariable-calculus/08_vector_calculus_theorems', '/multivariable-calculus/08_vector_calculus_theorems/', '/multivariable-calculus/8_vector_calculus_theorems', '/multivariable-calculus/8_vector_calculus_theorems/', 'multivariable-calculus/08_vector_calculus_theorems', 'multivariable-calculus/08_vector_calculus_theorems/', 'multivariable-calculus/8_vector_calculus_theorems', 'multivariable-calculus/8_vector_calculus_theorems/'
);

-- viewId 144: multivariable-calculus/index
UPDATE page_views SET view_id = 144
WHERE view_id IS NULL AND page_path IN (
  '/Multivariable%20Calculus/index', '/Multivariable%20Calculus/index/', '/Multivariable%20Calculus/preface', '/Multivariable%20Calculus/preface/', '/calculus/0_preface', '/calculus/0_preface/', '/multivariable-calculus/00_index', '/multivariable-calculus/00_index/', '/multivariable-calculus/0_preface', '/multivariable-calculus/0_preface/', '/multivariable-calculus/index', '/multivariable-calculus/index/', 'Multivariable%20Calculus/index', 'Multivariable%20Calculus/index/', 'Multivariable%20Calculus/preface', 'Multivariable%20Calculus/preface/', 'calculus/0_preface', 'calculus/0_preface/', 'multivariable-calculus/00_index', 'multivariable-calculus/00_index/', 'multivariable-calculus/0_preface', 'multivariable-calculus/0_preface/', 'multivariable-calculus/index', 'multivariable-calculus/index/'
);

-- viewId 145: national-qualifiers-2027/_00_how_we_got_here
UPDATE page_views SET view_id = 145
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/00_how_we_got_here', '/national-qualifiers-2027/00_how_we_got_here/', '/resistance-training/01_how_we_got_here', '/resistance-training/01_how_we_got_here/', 'national-qualifiers-2027/00_how_we_got_here', 'national-qualifiers-2027/00_how_we_got_here/', 'resistance-training/01_how_we_got_here', 'resistance-training/01_how_we_got_here/'
);

-- viewId 146: national-qualifiers-2027/_01_2026_training_plan
UPDATE page_views SET view_id = 146
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/01_2026_training_plan', '/national-qualifiers-2027/01_2026_training_plan/', '/triathlon-program/01_2026_training_plan', '/triathlon-program/01_2026_training_plan/', 'national-qualifiers-2027/01_2026_training_plan', 'national-qualifiers-2027/01_2026_training_plan/', 'triathlon-program/01_2026_training_plan', 'triathlon-program/01_2026_training_plan/'
);

-- viewId 147: national-qualifiers-2027/_20_qualification_checklist
UPDATE page_views SET view_id = 147
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/20_qualification_checklist', '/national-qualifiers-2027/20_qualification_checklist/', 'national-qualifiers-2027/20_qualification_checklist', 'national-qualifiers-2027/20_qualification_checklist/'
);

-- viewId 148: national-qualifiers-2027/index
UPDATE page_views SET view_id = 148
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/00_index', '/national-qualifiers-2027/00_index/', '/national-qualifiers-2027/index', '/national-qualifiers-2027/index/', '/triathlon-program/00_preface', '/triathlon-program/00_preface/', 'national-qualifiers-2027/00_index', 'national-qualifiers-2027/00_index/', 'national-qualifiers-2027/index', 'national-qualifiers-2027/index/', 'triathlon-program/00_preface', 'triathlon-program/00_preface/'
);

-- viewId 149: national-qualifiers-2027/week_10_may_18_may_24
UPDATE page_views SET view_id = 149
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/12_week10', '/national-qualifiers-2027/12_week10/', '/national-qualifiers-2027/week_10_may_18_may_24', '/national-qualifiers-2027/week_10_may_18_may_24/', 'national-qualifiers-2027/12_week10', 'national-qualifiers-2027/12_week10/', 'national-qualifiers-2027/week_10_may_18_may_24', 'national-qualifiers-2027/week_10_may_18_may_24/'
);

-- viewId 150: national-qualifiers-2027/week_11_may_25_may_31
UPDATE page_views SET view_id = 150
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/13_week11', '/national-qualifiers-2027/13_week11/', 'national-qualifiers-2027/13_week11', 'national-qualifiers-2027/13_week11/'
);

-- viewId 151: national-qualifiers-2027/week_12_jun_1_jun_7
UPDATE page_views SET view_id = 151
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/14_week12', '/national-qualifiers-2027/14_week12/', 'national-qualifiers-2027/14_week12', 'national-qualifiers-2027/14_week12/'
);

-- viewId 152: national-qualifiers-2027/week_13_jun_8_jun_14
UPDATE page_views SET view_id = 152
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/15_week13', '/national-qualifiers-2027/15_week13/', '/national-qualifiers-2027/week_13_jun_8_jun_14', '/national-qualifiers-2027/week_13_jun_8_jun_14/', 'national-qualifiers-2027/15_week13', 'national-qualifiers-2027/15_week13/', 'national-qualifiers-2027/week_13_jun_8_jun_14', 'national-qualifiers-2027/week_13_jun_8_jun_14/'
);

-- viewId 153: national-qualifiers-2027/week_14_jun_15_jun_21
UPDATE page_views SET view_id = 153
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/16_week14', '/national-qualifiers-2027/16_week14/', 'national-qualifiers-2027/16_week14', 'national-qualifiers-2027/16_week14/'
);

-- viewId 154: national-qualifiers-2027/week_15_jun_22_jun_28
UPDATE page_views SET view_id = 154
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/17_week15', '/national-qualifiers-2027/17_week15/', '/national-qualifiers-2027/week_15_jun_22_jun_28', '/national-qualifiers-2027/week_15_jun_22_jun_28/', 'national-qualifiers-2027/17_week15', 'national-qualifiers-2027/17_week15/', 'national-qualifiers-2027/week_15_jun_22_jun_28', 'national-qualifiers-2027/week_15_jun_22_jun_28/'
);

-- viewId 155: national-qualifiers-2027/week_16_jun_29_jul_5
UPDATE page_views SET view_id = 155
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/18_week16', '/national-qualifiers-2027/18_week16/', '/national-qualifiers-2027/week_16_jun_29_jul_5', '/national-qualifiers-2027/week_16_jun_29_jul_5/', 'national-qualifiers-2027/18_week16', 'national-qualifiers-2027/18_week16/', 'national-qualifiers-2027/week_16_jun_29_jul_5', 'national-qualifiers-2027/week_16_jun_29_jul_5/'
);

-- viewId 156: national-qualifiers-2027/week_1_mar_16_mar_22
UPDATE page_views SET view_id = 156
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/03_week1', '/national-qualifiers-2027/03_week1/', '/national-qualifiers-2027/week_1_mar_16_mar_22', '/national-qualifiers-2027/week_1_mar_16_mar_22/', '/triathlon-program/03_week1', '/triathlon-program/03_week1/', 'national-qualifiers-2027/03_week1', 'national-qualifiers-2027/03_week1/', 'national-qualifiers-2027/week_1_mar_16_mar_22', 'national-qualifiers-2027/week_1_mar_16_mar_22/', 'triathlon-program/03_week1', 'triathlon-program/03_week1/'
);

-- viewId 157: national-qualifiers-2027/week_2_mar_23_mar_29
UPDATE page_views SET view_id = 157
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/04_week2', '/national-qualifiers-2027/04_week2/', '/national-qualifiers-2027/week_2_mar_23_mar_29', '/national-qualifiers-2027/week_2_mar_23_mar_29/', '/triathlon-program/04_week2', '/triathlon-program/04_week2/', 'national-qualifiers-2027/04_week2', 'national-qualifiers-2027/04_week2/', 'national-qualifiers-2027/week_2_mar_23_mar_29', 'national-qualifiers-2027/week_2_mar_23_mar_29/', 'triathlon-program/04_week2', 'triathlon-program/04_week2/'
);

-- viewId 158: national-qualifiers-2027/week_3_mar_30_apr_5
UPDATE page_views SET view_id = 158
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/05_week3', '/national-qualifiers-2027/05_week3/', '/triathlon-program/05_week3', '/triathlon-program/05_week3/', 'national-qualifiers-2027/05_week3', 'national-qualifiers-2027/05_week3/', 'triathlon-program/05_week3', 'triathlon-program/05_week3/'
);

-- viewId 159: national-qualifiers-2027/week_4_apr_6_apr_12
UPDATE page_views SET view_id = 159
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/06_week4', '/national-qualifiers-2027/06_week4/', '/triathlon-program/06_week4', '/triathlon-program/06_week4/', 'national-qualifiers-2027/06_week4', 'national-qualifiers-2027/06_week4/', 'triathlon-program/06_week4', 'triathlon-program/06_week4/'
);

-- viewId 160: national-qualifiers-2027/week_5_apr_13_apr_19
UPDATE page_views SET view_id = 160
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/07_week5', '/national-qualifiers-2027/07_week5/', '/national-qualifiers-2027/week_5_apr_13_apr_19', '/national-qualifiers-2027/week_5_apr_13_apr_19/', 'national-qualifiers-2027/07_week5', 'national-qualifiers-2027/07_week5/', 'national-qualifiers-2027/week_5_apr_13_apr_19', 'national-qualifiers-2027/week_5_apr_13_apr_19/'
);

-- viewId 161: national-qualifiers-2027/week_6_apr_20_apr_26
UPDATE page_views SET view_id = 161
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/08_week6', '/national-qualifiers-2027/08_week6/', 'national-qualifiers-2027/08_week6', 'national-qualifiers-2027/08_week6/'
);

-- viewId 162: national-qualifiers-2027/week_7_apr_27_may_3
UPDATE page_views SET view_id = 162
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/09_week7', '/national-qualifiers-2027/09_week7/', 'national-qualifiers-2027/09_week7', 'national-qualifiers-2027/09_week7/'
);

-- viewId 163: national-qualifiers-2027/week_8_may_4_may_10
UPDATE page_views SET view_id = 163
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/10_week8', '/national-qualifiers-2027/10_week8/', 'national-qualifiers-2027/10_week8', 'national-qualifiers-2027/10_week8/'
);

-- viewId 164: national-qualifiers-2027/week_9_may_11_may_17
UPDATE page_views SET view_id = 164
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/11_week9', '/national-qualifiers-2027/11_week9/', 'national-qualifiers-2027/11_week9', 'national-qualifiers-2027/11_week9/'
);

-- viewId 165: pythonta/index
UPDATE page_views SET view_id = 165
WHERE view_id IS NULL AND page_path IN (
  '/PythonTA/index', '/PythonTA/index/', '/pythonta/00_index', '/pythonta/00_index/', '/pythonta/index', '/pythonta/index/', 'PythonTA/index', 'PythonTA/index/', 'pythonta/00_index', 'pythonta/00_index/', 'pythonta/index', 'pythonta/index/'
);

-- viewId 166: pythonta/pythonta
UPDATE page_views SET view_id = 166
WHERE view_id IS NULL AND page_path IN (
  '/PythonTA/pythonta', '/PythonTA/pythonta/', '/department-of-computer-science/1-pythonta/01_pythonta', '/department-of-computer-science/1-pythonta/01_pythonta/', '/pythonta/01_pythonta', '/pythonta/01_pythonta/', '/pythonta/pythonta', '/pythonta/pythonta/', 'PythonTA/pythonta', 'PythonTA/pythonta/', 'department-of-computer-science/1-pythonta/01_pythonta', 'department-of-computer-science/1-pythonta/01_pythonta/', 'pythonta/01_pythonta', 'pythonta/01_pythonta/', 'pythonta/pythonta', 'pythonta/pythonta/'
);

-- viewId 167: sleep-and-nutrition/index
UPDATE page_views SET view_id = 167
WHERE view_id IS NULL AND page_path IN (
  '/sleep-&-nutrition/index', '/sleep-&-nutrition/index/', '/sleep--nutrition/00_index', '/sleep--nutrition/00_index/', '/sleep-and-nutrition/index', '/sleep-and-nutrition/index/', 'sleep-&-nutrition/index', 'sleep-&-nutrition/index/', 'sleep--nutrition/00_index', 'sleep--nutrition/00_index/', 'sleep-and-nutrition/index', 'sleep-and-nutrition/index/'
);

-- viewId 168: sleep-and-nutrition/nutrition_protocol
UPDATE page_views SET view_id = 168
WHERE view_id IS NULL AND page_path IN (
  '/national-qualifiers-2027/02_nutrition', '/national-qualifiers-2027/02_nutrition/', '/sleep-&-nutrition/nutrition_protocol', '/sleep-&-nutrition/nutrition_protocol/', '/sleep--nutrition/02_nutrition_protocol', '/sleep--nutrition/02_nutrition_protocol/', '/sleep--nutrition/nutrition_protocol', '/sleep--nutrition/nutrition_protocol/', '/sleep-and-nutrition/nutrition_protocol', '/sleep-and-nutrition/nutrition_protocol/', '/triathlon-program/02_nutrition', '/triathlon-program/02_nutrition/', 'national-qualifiers-2027/02_nutrition', 'national-qualifiers-2027/02_nutrition/', 'sleep-&-nutrition/nutrition_protocol', 'sleep-&-nutrition/nutrition_protocol/', 'sleep--nutrition/02_nutrition_protocol', 'sleep--nutrition/02_nutrition_protocol/', 'sleep--nutrition/nutrition_protocol', 'sleep--nutrition/nutrition_protocol/', 'sleep-and-nutrition/nutrition_protocol', 'sleep-and-nutrition/nutrition_protocol/', 'triathlon-program/02_nutrition', 'triathlon-program/02_nutrition/'
);

-- viewId 169: sleep-and-nutrition/sleep_protocol
UPDATE page_views SET view_id = 169
WHERE view_id IS NULL AND page_path IN (
  '/sleep-&-nutrition/sleep_protocol', '/sleep-&-nutrition/sleep_protocol/', '/sleep--nutrition/01_sleep_protocol', '/sleep--nutrition/01_sleep_protocol/', '/sleep--nutrition/sleep_protocol', '/sleep--nutrition/sleep_protocol/', '/sleep-and-nutrition/sleep_protocol', '/sleep-and-nutrition/sleep_protocol/', 'sleep-&-nutrition/sleep_protocol', 'sleep-&-nutrition/sleep_protocol/', 'sleep--nutrition/01_sleep_protocol', 'sleep--nutrition/01_sleep_protocol/', 'sleep--nutrition/sleep_protocol', 'sleep--nutrition/sleep_protocol/', 'sleep-and-nutrition/sleep_protocol', 'sleep-and-nutrition/sleep_protocol/'
);

-- viewId 170: software-design/design_patterns
UPDATE page_views SET view_id = 170
WHERE view_id IS NULL AND page_path IN (
  '/software-design/03_design_patterns', '/software-design/03_design_patterns/', '/software-design/design_patterns', '/software-design/design_patterns/', 'software-design/03_design_patterns', 'software-design/03_design_patterns/', 'software-design/design_patterns', 'software-design/design_patterns/'
);

-- viewId 171: software-design/index
UPDATE page_views SET view_id = 171
WHERE view_id IS NULL AND page_path IN (
  '/software-design/00_index', '/software-design/00_index/', '/software-design/0_preface', '/software-design/0_preface/', '/software-design/index', '/software-design/index/', 'software-design/00_index', 'software-design/00_index/', 'software-design/0_preface', 'software-design/0_preface/', 'software-design/index', 'software-design/index/'
);

-- viewId 172: software-design/object_oriented_programming_in_python
UPDATE page_views SET view_id = 172
WHERE view_id IS NULL AND page_path IN (
  '/software-design/01_oop_python', '/software-design/01_oop_python/', '/software-design/object_oriented_programming_in_python', '/software-design/object_oriented_programming_in_python/', 'software-design/01_oop_python', 'software-design/01_oop_python/', 'software-design/object_oriented_programming_in_python', 'software-design/object_oriented_programming_in_python/'
);

-- viewId 173: software-design/solid_principles
UPDATE page_views SET view_id = 173
WHERE view_id IS NULL AND page_path IN (
  '/software-design/02_solid_principles', '/software-design/02_solid_principles/', '/software-design/solid_principles', '/software-design/solid_principles/', 'software-design/02_solid_principles', 'software-design/02_solid_principles/', 'software-design/solid_principles', 'software-design/solid_principles/'
);

-- viewId 174: us-government/1-foundations/democratic_ideals_and_types_of_democracy
UPDATE page_views SET view_id = 174
WHERE view_id IS NULL AND page_path IN (
  '/us-government/1-foundations/01_democratic_ideals', '/us-government/1-foundations/01_democratic_ideals/', '/us-government/1-foundations/democratic_ideals_and_types_of_democracy', '/us-government/1-foundations/democratic_ideals_and_types_of_democracy/', 'us-government/1-foundations/01_democratic_ideals', 'us-government/1-foundations/01_democratic_ideals/', 'us-government/1-foundations/democratic_ideals_and_types_of_democracy', 'us-government/1-foundations/democratic_ideals_and_types_of_democracy/'
);

-- viewId 175: us-government/1-foundations/federalism
UPDATE page_views SET view_id = 175
WHERE view_id IS NULL AND page_path IN (
  '/us-government/1-foundations/05_federalism', '/us-government/1-foundations/05_federalism/', 'us-government/1-foundations/05_federalism', 'us-government/1-foundations/05_federalism/'
);

-- viewId 176: us-government/1-foundations/federalists_vs_anti_federalists
UPDATE page_views SET view_id = 176
WHERE view_id IS NULL AND page_path IN (
  '/us-government/1-foundations/02_federalists_antifederalists', '/us-government/1-foundations/02_federalists_antifederalists/', 'us-government/1-foundations/02_federalists_antifederalists', 'us-government/1-foundations/02_federalists_antifederalists/'
);

-- viewId 177: us-government/1-foundations/index
UPDATE page_views SET view_id = 177
WHERE view_id IS NULL AND page_path IN (
  '/us-government/1-foundations/index', '/us-government/1-foundations/index/', 'us-government/1-foundations/index', 'us-government/1-foundations/index/'
);

-- viewId 178: us-government/1-foundations/separation_of_powers_and_checks_and_balances
UPDATE page_views SET view_id = 178
WHERE view_id IS NULL AND page_path IN (
  '/us-government/1-foundations/04_separation_of_powers', '/us-government/1-foundations/04_separation_of_powers/', 'us-government/1-foundations/04_separation_of_powers', 'us-government/1-foundations/04_separation_of_powers/'
);

-- viewId 179: us-government/1-foundations/the_constitutional_convention
UPDATE page_views SET view_id = 179
WHERE view_id IS NULL AND page_path IN (
  '/us-government/1-foundations/03_constitutional_convention', '/us-government/1-foundations/03_constitutional_convention/', 'us-government/1-foundations/03_constitutional_convention', 'us-government/1-foundations/03_constitutional_convention/'
);

-- viewId 180: us-government/2-branches/congress_structure_and_powers
UPDATE page_views SET view_id = 180
WHERE view_id IS NULL AND page_path IN (
  '/us-government/2-branches/01_congress_structure', '/us-government/2-branches/01_congress_structure/', '/us-government/2-branches/congress_structure_and_powers', '/us-government/2-branches/congress_structure_and_powers/', 'us-government/2-branches/01_congress_structure', 'us-government/2-branches/01_congress_structure/', 'us-government/2-branches/congress_structure_and_powers', 'us-government/2-branches/congress_structure_and_powers/'
);

-- viewId 181: us-government/2-branches/congressional_behavior
UPDATE page_views SET view_id = 181
WHERE view_id IS NULL AND page_path IN (
  '/us-government/2-branches/02_congressional_behavior', '/us-government/2-branches/02_congressional_behavior/', 'us-government/2-branches/02_congressional_behavior', 'us-government/2-branches/02_congressional_behavior/'
);

-- viewId 182: us-government/2-branches/the_judiciary
UPDATE page_views SET view_id = 182
WHERE view_id IS NULL AND page_path IN (
  '/us-government/2-branches/04_the_judiciary', '/us-government/2-branches/04_the_judiciary/', 'us-government/2-branches/04_the_judiciary', 'us-government/2-branches/04_the_judiciary/'
);

-- viewId 183: us-government/2-branches/the_presidency
UPDATE page_views SET view_id = 183
WHERE view_id IS NULL AND page_path IN (
  '/us-government/2-branches/03_the_presidency', '/us-government/2-branches/03_the_presidency/', 'us-government/2-branches/03_the_presidency', 'us-government/2-branches/03_the_presidency/'
);

-- viewId 184: us-government/3-civil-liberties/first_amendment_religion_and_speech
UPDATE page_views SET view_id = 184
WHERE view_id IS NULL AND page_path IN (
  '/us-government/3-civil-liberties/02_first_amendment_religion_speech', '/us-government/3-civil-liberties/02_first_amendment_religion_speech/', 'us-government/3-civil-liberties/02_first_amendment_religion_speech', 'us-government/3-civil-liberties/02_first_amendment_religion_speech/'
);

-- viewId 185: us-government/3-civil-liberties/press_assembly_and_the_right_to_bear_arms
UPDATE page_views SET view_id = 185
WHERE view_id IS NULL AND page_path IN (
  '/us-government/3-civil-liberties/03_press_assembly_arms', '/us-government/3-civil-liberties/03_press_assembly_arms/', '/us-government/3-civil-liberties/press_assembly_and_the_right_to_bear_arms', '/us-government/3-civil-liberties/press_assembly_and_the_right_to_bear_arms/', 'us-government/3-civil-liberties/03_press_assembly_arms', 'us-government/3-civil-liberties/03_press_assembly_arms/', 'us-government/3-civil-liberties/press_assembly_and_the_right_to_bear_arms', 'us-government/3-civil-liberties/press_assembly_and_the_right_to_bear_arms/'
);

-- viewId 186: us-government/3-civil-liberties/the_bill_of_rights_and_selective_incorporation
UPDATE page_views SET view_id = 186
WHERE view_id IS NULL AND page_path IN (
  '/us-government/3-civil-liberties/01_bill_of_rights', '/us-government/3-civil-liberties/01_bill_of_rights/', 'us-government/3-civil-liberties/01_bill_of_rights', 'us-government/3-civil-liberties/01_bill_of_rights/'
);

-- viewId 187: us-government/4-political-ideologies/american_political_ideologies
UPDATE page_views SET view_id = 187
WHERE view_id IS NULL AND page_path IN (
  '/us-government/4-political-ideologies/03_political_ideologies', '/us-government/4-political-ideologies/03_political_ideologies/', 'us-government/4-political-ideologies/03_political_ideologies', 'us-government/4-political-ideologies/03_political_ideologies/'
);

-- viewId 188: us-government/4-political-ideologies/ideology_and_economic_policy
UPDATE page_views SET view_id = 188
WHERE view_id IS NULL AND page_path IN (
  '/us-government/4-political-ideologies/04_economic_policy', '/us-government/4-political-ideologies/04_economic_policy/', 'us-government/4-political-ideologies/04_economic_policy', 'us-government/4-political-ideologies/04_economic_policy/'
);

-- viewId 189: us-government/4-political-ideologies/ideology_and_social_policy
UPDATE page_views SET view_id = 189
WHERE view_id IS NULL AND page_path IN (
  '/us-government/4-political-ideologies/05_social_policy', '/us-government/4-political-ideologies/05_social_policy/', 'us-government/4-political-ideologies/05_social_policy', 'us-government/4-political-ideologies/05_social_policy/'
);

-- viewId 190: us-government/4-political-ideologies/measuring_public_opinion
UPDATE page_views SET view_id = 190
WHERE view_id IS NULL AND page_path IN (
  '/us-government/4-political-ideologies/02_public_opinion', '/us-government/4-political-ideologies/02_public_opinion/', 'us-government/4-political-ideologies/02_public_opinion', 'us-government/4-political-ideologies/02_public_opinion/'
);

-- viewId 191: us-government/4-political-ideologies/political_socialization
UPDATE page_views SET view_id = 191
WHERE view_id IS NULL AND page_path IN (
  '/us-government/4-political-ideologies/01_political_socialization', '/us-government/4-political-ideologies/01_political_socialization/', 'us-government/4-political-ideologies/01_political_socialization', 'us-government/4-political-ideologies/01_political_socialization/'
);

-- viewId 192: us-government/5-political-participation/campaigns_finance_and_media
UPDATE page_views SET view_id = 192
WHERE view_id IS NULL AND page_path IN (
  '/us-government/5-political-participation/05_campaigns_and_media', '/us-government/5-political-participation/05_campaigns_and_media/', 'us-government/5-political-participation/05_campaigns_and_media', 'us-government/5-political-participation/05_campaigns_and_media/'
);

-- viewId 193: us-government/5-political-participation/interest_groups_and_lobbying
UPDATE page_views SET view_id = 193
WHERE view_id IS NULL AND page_path IN (
  '/us-government/5-political-participation/03_interest_groups', '/us-government/5-political-participation/03_interest_groups/', 'us-government/5-political-participation/03_interest_groups', 'us-government/5-political-participation/03_interest_groups/'
);

-- viewId 194: us-government/5-political-participation/voting_rights_and_turnout
UPDATE page_views SET view_id = 194
WHERE view_id IS NULL AND page_path IN (
  '/us-government/5-political-participation/01_voting', '/us-government/5-political-participation/01_voting/', 'us-government/5-political-participation/01_voting', 'us-government/5-political-participation/01_voting/'
);

-- viewId 195: us-government/index
UPDATE page_views SET view_id = 195
WHERE view_id IS NULL AND page_path IN (
  '/us-government/00_index', '/us-government/00_index/', '/us-government/0_course_overview', '/us-government/0_course_overview/', '/us-government/index', '/us-government/index/', 'us-government/00_index', 'us-government/00_index/', 'us-government/0_course_overview', 'us-government/0_course_overview/', 'us-government/index', 'us-government/index/'
);

-- Step 4: Clean up garbage rows
DELETE FROM page_views WHERE ip_address IS NULL OR ip_address = 'unknown' OR ip_address = 'None';
DELETE FROM page_views WHERE page_path IN ('/test', '/test-pag', '/test-insert', '/test-page-123', '/test-visitor', '/test-owner', '//tasls', '/iner', '/favicon.pn', '/dreadnought_closet/');

-- Step 5: Verify
SELECT
  COUNT(*) as total_rows,
  COUNT(view_id) as rows_with_view_id,
  COUNT(*) - COUNT(view_id) as rows_without_view_id
FROM page_views;

-- Show unmapped paths (should be non-post pages only)
SELECT page_path, COUNT(*) as cnt
FROM page_views WHERE view_id IS NULL
GROUP BY page_path ORDER BY cnt DESC;

COMMIT;