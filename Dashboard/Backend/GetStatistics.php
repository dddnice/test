<?php
namespace com\OHT\Lib\api2\Dashboard;

use com\OHT\Lib\api2\CommandFullAuthAbstract;
use com\OHT\Lib\user\dashboard\TranslatorDashboard;
use com\OHT\Lib\Users\Statistics\TranslatorLeveling;
use CustomerStatistics;
use DateTime;
use OHT\Modules\Utils\MemCacheApi;
use Translator;
use User;
use UserACL;

class GetStatistics extends CommandFullAuthAbstract
{
    public const INPROGRESS = 'inprogress';

    public const CANCELED = 'canceled';

    public const COMPLETED = 'completed';

    public function _beforeExecute()
    {
        $this->setUserNoAct(User::current(User::NO_ACT));
    }

    protected function _execute()
    {
        $now = new DateTime();
        $tomorrow = (new DateTime())->modify('tomorrow');
        $expire = $tomorrow->getTimestamp() - $now->getTimestamp();
        $results = MemCacheApi::factory()
            ->setKey(TranslatorDashboard::getMemcacheKey($this->getUser()->getId(), $this->isAdminActed()))
            ->setExpire($expire)
            ->get(function () {
                return $this->getResults();
            });

        $this->responseObj->results = $results;

        return $this;
    }

    protected function initialize()
    {
        $this->requestParameterValidators = [
            'public_key' => [
                'alnum',
            ],
            'secret_key' => [
                'alnum',
            ],
        ];

        $this->requestParameterFilterOptions = [
            'breakChainOnFailure' => true,
        ];
    }

    private function getResults()
    {
        $results = [];
        $currentUser = $this->getUser();
        $results['newLevelingEnabled'] = $feature = TranslatorLeveling::getFeatureStatus($currentUser, true);

        if ($currentUser->isAdmin()) { // Admin
            $results['admin'] = $currentUser->getId();
        }

        if ($currentUser->isTranslator()) {
            $dashboard = TranslatorDashboard::factory($currentUser);

            $results['translator_id'] = $currentUser->getId();
            $results['translator_status'] = $currentUser->getTranslatorStatus();

            $results['general'] = [
                ['value' => $dashboard->getNumProjectsInProgress(), 'unit' => 'int', 'key' => 'projects_in_progress'],
                ['value' => $dashboard->getNumProjectsCompleted(), 'unit' => 'int', 'key' => 'projects_completed'],
                ['value' => $dashboard->getNumTranslatedWords(), 'unit' => 'int', 'key' => 'translated_words'],
                ['value' => $dashboard->getPriorityPoints(), 'unit' => 'int', 'key' => 'priority_points'],
                ['value' => $dashboard->getNumAbandonedProjects(), 'unit' => 'int', 'key' => 'abandoned_projects'],
                ['value' => $dashboard->getAbandonedTime(), 'unit' => 'seconds', 'key' => 'abandon_time'],
                ['value' => $dashboard->getNumReopenedProjects(), 'unit' => 'int', 'key' => 'reallocated_projects'],
            ];

            if ($feature) {
                $showMyTeam = $this->isAdminActed();
                $attributes = $dashboard->getLevelingAttributes($showMyTeam);
                $results['leveling'] = $attributes;
                $results['leveling']['current_level'] = $dashboard->getCurrentLevel();
                $results['leveling']['potential_level'] = $dashboard->getPotentialLevel($attributes);
                $results['leveling']['number_of_days'] = $dashboard->getDaysPassed();
                $results['leveling']['next_level_conditions'] = $dashboard->getNextLevelConditions();
                $results['leveling']['current_level_conditions'] = $dashboard->getCurrentLevelConditions();
                $results['leveling']['show_my_team'] = $showMyTeam;
                $results['general'][] = ['value' => $attributes[TranslatorLeveling::TL_WARNING_COUNT], 'unit' => 'int', 'key' => 'warnings_received'];
            } elseif (!$currentUser->hasRole(UserACL::PERM_GROUP_BILINGUAL)) {
                // Query
                $results['general'][] = ['value' => $dashboard->getReviewerPlaceInRespectToAllNativeLanguage(), 'unit' => 'int', 'key' => 'relative_rank'];
                // Query
                $pointsToNextLevel = $dashboard->getPointsToNextLevel();

                if ($pointsToNextLevel > 1) {
                    $results['general'][] = ['value' => $pointsToNextLevel, 'unit' => 'int', 'key' => 'points_to_the_next_level'];
                }
            }

            $results['quality'] = [
                // Flag TranslatorCalculator::TRANS_NUM_PROJECTS_DISPUTE
                ['value' => $dashboard->getNumDisputedProjects(), 'unit' => 'int', 'key' => 'disputed_projects'],
                ['value' => (string) $dashboard->getAvgQaRating(), 'unit' => 'float', 'key' => 'avg_qa_rating'],
            ];

            $results['reviewer'] = [
                ['value' => $dashboard->getNumReviewedProjects(), 'unit' => 'int', 'key' => 'reviewed_projects'],
                ['value' => $dashboard->getNumProjectsReviewedByUser(), 'unit' => 'int', 'key' => 'projects_reviewed_by_user'],
            ];

            if (TranslatorLeveling::getFeatureStatus($currentUser)) {
                $results['reviewer'][] = ['value' => $dashboard->countAllowedLLDisputes(), 'unit' => 'int', 'key' => 'allowed_ll_disputes'];
            }
        } else { // Customer
            $results['customer'] = $currentUser->getId();
            $customerStatistics = new CustomerStatistics($currentUser);
            $results['statistics'] = [
                ['value' => $customerStatistics->countCustomerProjects(), 'unit' => 'number', 'key' => 'projects_all'],
                ['value' => $customerStatistics->countCustomerProjects(self::INPROGRESS), 'unit' => 'number', 'key' => 'projects_in_progress'],
                ['value' => $customerStatistics->countCustomerProjects(self::CANCELED), 'unit' => 'number', 'key' => 'projects_canceled'],
                ['value' => $customerStatistics->countCustomerProjects(self::COMPLETED), 'unit' => 'number', 'key' => 'projects_completed'],
            ];
        }

        return $results;
    }

    private function isAdminActed(): bool
    {
        return $this->getUserNoAct() && $this->getUserNoAct()->isAdmin();
    }
}

